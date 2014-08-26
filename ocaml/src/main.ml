open Core

let sidebar =
  let side_bar = Option.value_exn (Jq.find "#sidebar") in
  Jq.find_descendants side_bar "a"
  |> Array.zip' [|
    Option.value_exn (Jq.find "#about");
    Option.value_exn (Jq.find "#officers")
  |]

let () =
  begin
    Array.iter sidebar ~f:(fun (div, link) ->
      Frp.Stream.iter (Jq.clicks link) ~f:(fun _ ->
        Array.iter sidebar ~f:(fun (div', _) ->
          Jq.css div' [|("display", "none")|]
        );
        Jq.css div [|("display", "block")|]
      ) |> ignore
    );
    Circles.main ()
  end
