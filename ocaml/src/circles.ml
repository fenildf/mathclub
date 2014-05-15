open Core

(* let () = Random.self_init () *)
let main_container =
  Option.value_exn (Jq.jq "#circles")

let width, height = 3000, 1000 (* 695, 478 *)

let distance p1 p2 = Vector.(norm (sub p1 p2))
let circle_radius center =
  Frp.Stream.map (Jq.relative_mouse_pos main_container) ~f:(fun pos ->
    8000. /. (distance (Arrow.both float_of_int pos) center))
  |> Frp.latest ~init:(Random.float 80.)

let centers = [|(400., 170.); (350., 360.); (600., 450.)|]

let circles = Array.map ~f:(fun ctr -> ctr, circle_radius ctr) centers

(* Computes the coefficients for the lines tangent
 * to the two input circles. I.e., returns pairs
 * (m, y0) where the tangent line is given by
 * the equation y = m x + y0 *)
let tangent_coefficents ((x1, y1), r1) ((x2, y2), r2) =
  let dx, dy = x2 -. x1, y2 -. y1 in
  let dr     = r2 -. r1 in
  let d      = sqrt (dx ** 2. +. dy ** 2.) in
  let nx     = dx /. d in
  let ny     = dy /. d in
  let nr     = dr /. d in
  let a k = (nr *. nx) -. (k *. ny *. sqrt (1. -. (nr ** 2.))) in
  let b k = (nr *. ny) +. (k *. nx *. sqrt (1. -. (nr ** 2.))) in
  Arrow.both
    (fun k -> let a' = a k in let b' = b k in 
           let c' = r1 -. (a' *. x1 +. b' *. y1)
            in (-. a' /. b', -. c' /. b'))
    (1., -1.)

let draw_line (slope, y0) =
  let far_x = 3000. in let open Draw.Segment in
  [| move_to (0., y0)
  ;  line_to (far_x, far_x *. slope +. y0)
  |]

(* Some nice colors: 
  * rgba(159,118,205,1.000000)
  * rgba(69,209,226,1.000000)
  * rgba(17,236,40,1.000000)
*)

let tangent_lines (c1, r1b) (c2, r2b) = let open Frp.Behavior in
  let segs_b =  zip_with r1b r2b ~f:(fun r1 r2 ->
      Arrow.both draw_line (tangent_coefficents (c1, r1) (c2, r2))) 
  in let open Draw in let c = Color.random () in
  [| path ~anchor:(return (0., 0.)) (map ~f:fst segs_b)
      ~props:[|return (Property.stroke c 2)|];
     path ~anchor:(return (0., 0.)) (map ~f:snd segs_b)
      ~props:[|return (Property.stroke c 2)|]|]

let arr_tail a = let n = Array.length a in
  Array.init (max (n - 1) 0) ~f:(fun i -> a.(i + 1))

let draw_circle (ctr, r) = let open Draw in let open Frp.Behavior in
  circle r (return ctr)
    ~props:[|return (Property.fill Color.none); return (Property.stroke Color.black 2)|]

let whole_shebang =
  Draw.pictures
    (Array.concat
      [ tangent_lines circles.(0) circles.(1)
      ; tangent_lines circles.(1) circles.(2)
      ; tangent_lines circles.(2) circles.(0)
      ; Array.map ~f:draw_circle circles
      ])

let () = begin
  let (svg, sub) = Draw.render_svg_node ~width ~height whole_shebang in
  Jq.Dom.append (Option.value_exn (Jq.to_dom_node main_container)) svg
end

