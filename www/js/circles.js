// This program was compiled from OCaml by js_of_ocaml 1.4
function caml_raise_with_arg (tag, arg) { throw [0, tag, arg]; }
function caml_raise_with_string (tag, msg) {
  caml_raise_with_arg (tag, new MlWrappedString (msg));
}
function caml_invalid_argument (msg) {
  caml_raise_with_string(caml_global_data[4], msg);
}
function caml_array_bound_error () {
  caml_invalid_argument("index out of bounds");
}
function caml_str_repeat(n, s) {
  if (!n) { return ""; }
  if (n & 1) { return caml_str_repeat(n - 1, s) + s; }
  var r = caml_str_repeat(n >> 1, s);
  return r + r;
}
function MlString(param) {
  if (param != null) {
    this.bytes = this.fullBytes = param;
    this.last = this.len = param.length;
  }
}
MlString.prototype = {
  string:null,
  bytes:null,
  fullBytes:null,
  array:null,
  len:null,
  last:0,
  toJsString:function() {
    return this.string = decodeURIComponent (escape(this.getFullBytes()));
  },
  toBytes:function() {
    if (this.string != null)
      var b = unescape (encodeURIComponent (this.string));
    else {
      var b = "", a = this.array, l = a.length;
      for (var i = 0; i < l; i ++) b += String.fromCharCode (a[i]);
    }
    this.bytes = this.fullBytes = b;
    this.last = this.len = b.length;
    return b;
  },
  getBytes:function() {
    var b = this.bytes;
    if (b == null) b = this.toBytes();
    return b;
  },
  getFullBytes:function() {
    var b = this.fullBytes;
    if (b !== null) return b;
    b = this.bytes;
    if (b == null) b = this.toBytes ();
    if (this.last < this.len) {
      this.bytes = (b += caml_str_repeat(this.len - this.last, '\0'));
      this.last = this.len;
    }
    this.fullBytes = b;
    return b;
  },
  toArray:function() {
    var b = this.bytes;
    if (b == null) b = this.toBytes ();
    var a = [], l = this.last;
    for (var i = 0; i < l; i++) a[i] = b.charCodeAt(i);
    for (l = this.len; i < l; i++) a[i] = 0;
    this.string = this.bytes = this.fullBytes = null;
    this.last = this.len;
    this.array = a;
    return a;
  },
  getArray:function() {
    var a = this.array;
    if (!a) a = this.toArray();
    return a;
  },
  getLen:function() {
    var len = this.len;
    if (len !== null) return len;
    this.toBytes();
    return this.len;
  },
  toString:function() { var s = this.string; return s?s:this.toJsString(); },
  valueOf:function() { var s = this.string; return s?s:this.toJsString(); },
  blitToArray:function(i1, a2, i2, l) {
    var a1 = this.array;
    if (a1) {
      if (i2 <= i1) {
        for (var i = 0; i < l; i++) a2[i2 + i] = a1[i1 + i];
      } else {
        for (var i = l - 1; i >= 0; i--) a2[i2 + i] = a1[i1 + i];
      }
    } else {
      var b = this.bytes;
      if (b == null) b = this.toBytes();
      var l1 = this.last - i1;
      if (l <= l1)
        for (var i = 0; i < l; i++) a2 [i2 + i] = b.charCodeAt(i1 + i);
      else {
        for (var i = 0; i < l1; i++) a2 [i2 + i] = b.charCodeAt(i1 + i);
        for (; i < l; i++) a2 [i2 + i] = 0;
      }
    }
  },
  get:function (i) {
    var a = this.array;
    if (a) return a[i];
    var b = this.bytes;
    if (b == null) b = this.toBytes();
    return (i<this.last)?b.charCodeAt(i):0;
  },
  safeGet:function (i) {
    if (this.len == null) this.toBytes();
    if ((i < 0) || (i >= this.len)) caml_array_bound_error ();
    return this.get(i);
  },
  set:function (i, c) {
    var a = this.array;
    if (!a) {
      if (this.last == i) {
        this.bytes += String.fromCharCode (c & 0xff);
        this.last ++;
        return 0;
      }
      a = this.toArray();
    } else if (this.bytes != null) {
      this.bytes = this.fullBytes = this.string = null;
    }
    a[i] = c & 0xff;
    return 0;
  },
  safeSet:function (i, c) {
    if (this.len == null) this.toBytes ();
    if ((i < 0) || (i >= this.len)) caml_array_bound_error ();
    this.set(i, c);
  },
  fill:function (ofs, len, c) {
    if (ofs >= this.last && this.last && c == 0) return;
    var a = this.array;
    if (!a) a = this.toArray();
    else if (this.bytes != null) {
      this.bytes = this.fullBytes = this.string = null;
    }
    var l = ofs + len;
    for (var i = ofs; i < l; i++) a[i] = c;
  },
  compare:function (s2) {
    if (this.string != null && s2.string != null) {
      if (this.string < s2.string) return -1;
      if (this.string > s2.string) return 1;
      return 0;
    }
    var b1 = this.getFullBytes ();
    var b2 = s2.getFullBytes ();
    if (b1 < b2) return -1;
    if (b1 > b2) return 1;
    return 0;
  },
  equal:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string == s2.string;
    return this.getFullBytes () == s2.getFullBytes ();
  },
  lessThan:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string < s2.string;
    return this.getFullBytes () < s2.getFullBytes ();
  },
  lessEqual:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string <= s2.string;
    return this.getFullBytes () <= s2.getFullBytes ();
  }
}
function MlWrappedString (s) { this.string = s; }
MlWrappedString.prototype = new MlString();
function MlMakeString (l) { this.bytes = ""; this.len = l; }
MlMakeString.prototype = new MlString ();
function caml_array_append(a1, a2) {
  return a1.concat(a2.slice(1));
}
function caml_array_concat(l) {
  var a = [0];
  while (l != 0) {
    var b = l[1];
    for (var i = 1; i < b.length; i++) a.push(b[i]);
    l = l[2];
  }
  return a;
}
function caml_array_get (array, index) {
  if ((index < 0) || (index >= array.length - 1)) caml_array_bound_error();
  return array[index+1];
}
function caml_array_set (array, index, newval) {
  if ((index < 0) || (index >= array.length - 1)) caml_array_bound_error();
  array[index+1]=newval; return 0;
}
function caml_array_sub (a, i, len) {
  return [0].concat(a.slice(i+1, i+1+len));
}
function caml_blit_string(s1, i1, s2, i2, len) {
  if (len === 0) return;
  if (i2 === s2.last && s2.bytes != null) {
    var b = s1.bytes;
    if (b == null) b = s1.toBytes ();
    if (i1 > 0 || s1.last > len) b = b.slice(i1, i1 + len);
    s2.bytes += b;
    s2.last += b.length;
    return;
  }
  var a = s2.array;
  if (!a) a = s2.toArray(); else { s2.bytes = s2.string = null; }
  s1.blitToArray (i1, a, i2, len);
}
function caml_call_gen(f, args) {
  if(f.fun)
    return caml_call_gen(f.fun, args);
  var n = f.length;
  var d = n - args.length;
  if (d == 0)
    return f.apply(null, args);
  else if (d < 0)
    return caml_call_gen(f.apply(null, args.slice(0,n)), args.slice(n));
  else
    return function (x){ return caml_call_gen(f, args.concat([x])); };
}
function caml_classify_float (x) {
  if (isFinite (x)) {
    if (Math.abs(x) >= 2.2250738585072014e-308) return 0;
    if (x != 0) return 1;
    return 2;
  }
  return isNaN(x)?4:3;
}
function caml_create_string(len) {
  if (len < 0) caml_invalid_argument("String.create");
  return new MlMakeString(len);
}
function caml_fill_string(s, i, l, c) { s.fill (i, l, c); }
function caml_parse_format (fmt) {
  fmt = fmt.toString ();
  var len = fmt.length;
  if (len > 31) caml_invalid_argument("format_int: format too long");
  var f =
    { justify:'+', signstyle:'-', filler:' ', alternate:false,
      base:0, signedconv:false, width:0, uppercase:false,
      sign:1, prec:-1, conv:'f' };
  for (var i = 0; i < len; i++) {
    var c = fmt.charAt(i);
    switch (c) {
    case '-':
      f.justify = '-'; break;
    case '+': case ' ':
      f.signstyle = c; break;
    case '0':
      f.filler = '0'; break;
    case '#':
      f.alternate = true; break;
    case '1': case '2': case '3': case '4': case '5':
    case '6': case '7': case '8': case '9':
      f.width = 0;
      while (c=fmt.charCodeAt(i) - 48, c >= 0 && c <= 9) {
        f.width = f.width * 10 + c; i++
      }
      i--;
     break;
    case '.':
      f.prec = 0;
      i++;
      while (c=fmt.charCodeAt(i) - 48, c >= 0 && c <= 9) {
        f.prec = f.prec * 10 + c; i++
      }
      i--;
    case 'd': case 'i':
      f.signedconv = true; /* fallthrough */
    case 'u':
      f.base = 10; break;
    case 'x':
      f.base = 16; break;
    case 'X':
      f.base = 16; f.uppercase = true; break;
    case 'o':
      f.base = 8; break;
    case 'e': case 'f': case 'g':
      f.signedconv = true; f.conv = c; break;
    case 'E': case 'F': case 'G':
      f.signedconv = true; f.uppercase = true;
      f.conv = c.toLowerCase (); break;
    }
  }
  return f;
}
function caml_finish_formatting(f, rawbuffer) {
  if (f.uppercase) rawbuffer = rawbuffer.toUpperCase();
  var len = rawbuffer.length;
  if (f.signedconv && (f.sign < 0 || f.signstyle != '-')) len++;
  if (f.alternate) {
    if (f.base == 8) len += 1;
    if (f.base == 16) len += 2;
  }
  var buffer = "";
  if (f.justify == '+' && f.filler == ' ')
    for (var i = len; i < f.width; i++) buffer += ' ';
  if (f.signedconv) {
    if (f.sign < 0) buffer += '-';
    else if (f.signstyle != '-') buffer += f.signstyle;
  }
  if (f.alternate && f.base == 8) buffer += '0';
  if (f.alternate && f.base == 16) buffer += "0x";
  if (f.justify == '+' && f.filler == '0')
    for (var i = len; i < f.width; i++) buffer += '0';
  buffer += rawbuffer;
  if (f.justify == '-')
    for (var i = len; i < f.width; i++) buffer += ' ';
  return new MlWrappedString (buffer);
}
function caml_format_float (fmt, x) {
  var s, f = caml_parse_format(fmt);
  var prec = (f.prec < 0)?6:f.prec;
  if (x < 0) { f.sign = -1; x = -x; }
  if (isNaN(x)) { s = "nan"; f.filler = ' '; }
  else if (!isFinite(x)) { s = "inf"; f.filler = ' '; }
  else
    switch (f.conv) {
    case 'e':
      var s = x.toExponential(prec);
      var i = s.length;
      if (s.charAt(i - 3) == 'e')
        s = s.slice (0, i - 1) + '0' + s.slice (i - 1);
      break;
    case 'f':
      s = x.toFixed(prec); break;
    case 'g':
      prec = prec?prec:1;
      s = x.toExponential(prec - 1);
      var j = s.indexOf('e');
      var exp = +s.slice(j + 1);
      if (exp < -4 || x.toFixed(0).length > prec) {
        var i = j - 1; while (s.charAt(i) == '0') i--;
        if (s.charAt(i) == '.') i--;
        s = s.slice(0, i + 1) + s.slice(j);
        i = s.length;
        if (s.charAt(i - 3) == 'e')
          s = s.slice (0, i - 1) + '0' + s.slice (i - 1);
        break;
      } else {
        var p = prec;
        if (exp < 0) { p -= exp + 1; s = x.toFixed(p); }
        else while (s = x.toFixed(p), s.length > prec + 1) p--;
        if (p) {
          var i = s.length - 1; while (s.charAt(i) == '0') i--;
          if (s.charAt(i) == '.') i--;
          s = s.slice(0, i + 1);
        }
      }
      break;
    }
  return caml_finish_formatting(f, s);
}
function caml_format_int(fmt, i) {
  if (fmt.toString() == "%d") return new MlWrappedString(""+i);
  var f = caml_parse_format(fmt);
  if (i < 0) { if (f.signedconv) { f.sign = -1; i = -i; } else i >>>= 0; }
  var s = i.toString(f.base);
  if (f.prec >= 0) {
    f.filler = ' ';
    var n = f.prec - s.length;
    if (n > 0) s = caml_str_repeat (n, '0') + s;
  }
  return caml_finish_formatting(f, s);
}
function caml_int64_is_negative(x) {
  return (x[3] << 16) < 0;
}
function caml_int64_neg (x) {
  var y1 = - x[1];
  var y2 = - x[2] + (y1 >> 24);
  var y3 = - x[3] + (y2 >> 24);
  return [255, y1 & 0xffffff, y2 & 0xffffff, y3 & 0xffff];
}
function caml_int64_of_int32 (x) {
  return [255, x & 0xffffff, (x >> 24) & 0xffffff, (x >> 31) & 0xffff]
}
function caml_int64_ucompare(x,y) {
  if (x[3] > y[3]) return 1;
  if (x[3] < y[3]) return -1;
  if (x[2] > y[2]) return 1;
  if (x[2] < y[2]) return -1;
  if (x[1] > y[1]) return 1;
  if (x[1] < y[1]) return -1;
  return 0;
}
function caml_int64_lsl1 (x) {
  x[3] = (x[3] << 1) | (x[2] >> 23);
  x[2] = ((x[2] << 1) | (x[1] >> 23)) & 0xffffff;
  x[1] = (x[1] << 1) & 0xffffff;
}
function caml_int64_lsr1 (x) {
  x[1] = ((x[1] >>> 1) | (x[2] << 23)) & 0xffffff;
  x[2] = ((x[2] >>> 1) | (x[3] << 23)) & 0xffffff;
  x[3] = x[3] >>> 1;
}
function caml_int64_sub (x, y) {
  var z1 = x[1] - y[1];
  var z2 = x[2] - y[2] + (z1 >> 24);
  var z3 = x[3] - y[3] + (z2 >> 24);
  return [255, z1 & 0xffffff, z2 & 0xffffff, z3 & 0xffff];
}
function caml_int64_udivmod (x, y) {
  var offset = 0;
  var modulus = x.slice ();
  var divisor = y.slice ();
  var quotient = [255, 0, 0, 0];
  while (caml_int64_ucompare (modulus, divisor) > 0) {
    offset++;
    caml_int64_lsl1 (divisor);
  }
  while (offset >= 0) {
    offset --;
    caml_int64_lsl1 (quotient);
    if (caml_int64_ucompare (modulus, divisor) >= 0) {
      quotient[1] ++;
      modulus = caml_int64_sub (modulus, divisor);
    }
    caml_int64_lsr1 (divisor);
  }
  return [0,quotient, modulus];
}
function caml_int64_to_int32 (x) {
  return x[1] | (x[2] << 24);
}
function caml_int64_is_zero(x) {
  return (x[3]|x[2]|x[1]) == 0;
}
function caml_int64_format (fmt, x) {
  var f = caml_parse_format(fmt);
  if (f.signedconv && caml_int64_is_negative(x)) {
    f.sign = -1; x = caml_int64_neg(x);
  }
  var buffer = "";
  var wbase = caml_int64_of_int32(f.base);
  var cvtbl = "0123456789abcdef";
  do {
    var p = caml_int64_udivmod(x, wbase);
    x = p[1];
    buffer = cvtbl.charAt(caml_int64_to_int32(p[2])) + buffer;
  } while (! caml_int64_is_zero(x));
  if (f.prec >= 0) {
    f.filler = ' ';
    var n = f.prec - buffer.length;
    if (n > 0) buffer = caml_str_repeat (n, '0') + buffer;
  }
  return caml_finish_formatting(f, buffer);
}
function caml_parse_sign_and_base (s) {
  var i = 0, base = 10, sign = s.get(0) == 45?(i++,-1):1;
  if (s.get(i) == 48)
    switch (s.get(i + 1)) {
    case 120: case 88: base = 16; i += 2; break;
    case 111: case 79: base =  8; i += 2; break;
    case  98: case 66: base =  2; i += 2; break;
    }
  return [i, sign, base];
}
function caml_parse_digit(c) {
  if (c >= 48 && c <= 57)  return c - 48;
  if (c >= 65 && c <= 90)  return c - 55;
  if (c >= 97 && c <= 122) return c - 87;
  return -1;
}
var caml_global_data = [0];
function caml_failwith (msg) {
  caml_raise_with_string(caml_global_data[3], msg);
}
function caml_int_of_string (s) {
  var r = caml_parse_sign_and_base (s);
  var i = r[0], sign = r[1], base = r[2];
  var threshold = -1 >>> 0;
  var c = s.get(i);
  var d = caml_parse_digit(c);
  if (d < 0 || d >= base) caml_failwith("int_of_string");
  var res = d;
  for (;;) {
    i++;
    c = s.get(i);
    if (c == 95) continue;
    d = caml_parse_digit(c);
    if (d < 0 || d >= base) break;
    res = base * res + d;
    if (res > threshold) caml_failwith("int_of_string");
  }
  if (i != s.getLen()) caml_failwith("int_of_string");
  res = sign * res;
  if ((res | 0) != res) caml_failwith("int_of_string");
  return res;
}
function caml_is_printable(c) { return +(c > 31 && c < 127); }
function caml_js_eval_string () {return eval(arguments[0].toString());}
function caml_js_from_array(a) { return a.slice(1); }
function caml_js_from_byte_string (s) {return s.getFullBytes();}
function caml_js_to_array(a) { return [0].concat(a); }
function caml_js_to_byte_string (s) {return new MlString (s);}
function caml_js_wrap_callback(f) {
  var toArray = Array.prototype.slice;
  return function () {
    var args = (arguments.length > 0)?toArray.call (arguments):[undefined];
    return caml_call_gen(f, args);
  }
}
function caml_make_vect (len, init) {
  var b = [0]; for (var i = 1; i <= len; i++) b[i] = init; return b;
}
function caml_ml_out_channels_list () { return 0; }
function caml_raise_constant (tag) { throw [0, tag]; }
function caml_raise_zero_divide () {
  caml_raise_constant(caml_global_data[6]);
}
function caml_mod(x,y) {
  if (y == 0) caml_raise_zero_divide ();
  return x%y;
}
function caml_mul(x,y) {
  return ((((x >> 16) * y) << 16) + (x & 0xffff) * y)|0;
}
function caml_register_global (n, v) { caml_global_data[n + 1] = v; }
var caml_named_values = {};
function caml_register_named_value(nm,v) {
  caml_named_values[nm] = v; return 0;
}
function caml_sys_const_word_size () { return 32; }
function caml_update_dummy (x, y) {
  if( typeof y==="function" ) { x.fun = y; return 0; }
  if( y.fun ) { x.fun = y.fun; return 0; }
  var i = y.length; while (i--) x[i] = y[i]; return 0;
}
(function()
   {function _nE_(_sn_,_so_,_sp_,_sq_,_sr_,_ss_,_st_,_su_)
     {return _sn_.length==7
              ?_sn_(_so_,_sp_,_sq_,_sr_,_ss_,_st_,_su_)
              :caml_call_gen(_sn_,[_so_,_sp_,_sq_,_sr_,_ss_,_st_,_su_]);}
    function _hW_(_sg_,_sh_,_si_,_sj_,_sk_,_sl_,_sm_)
     {return _sg_.length==6
              ?_sg_(_sh_,_si_,_sj_,_sk_,_sl_,_sm_)
              :caml_call_gen(_sg_,[_sh_,_si_,_sj_,_sk_,_sl_,_sm_]);}
    function _nw_(_sa_,_sb_,_sc_,_sd_,_se_,_sf_)
     {return _sa_.length==5
              ?_sa_(_sb_,_sc_,_sd_,_se_,_sf_)
              :caml_call_gen(_sa_,[_sb_,_sc_,_sd_,_se_,_sf_]);}
    function _nD_(_r7_,_r8_,_r9_,_r__,_r$_)
     {return _r7_.length==4
              ?_r7_(_r8_,_r9_,_r__,_r$_)
              :caml_call_gen(_r7_,[_r8_,_r9_,_r__,_r$_]);}
    function _dI_(_r3_,_r4_,_r5_,_r6_)
     {return _r3_.length==3
              ?_r3_(_r4_,_r5_,_r6_)
              :caml_call_gen(_r3_,[_r4_,_r5_,_r6_]);}
    function _eb_(_r0_,_r1_,_r2_)
     {return _r0_.length==2?_r0_(_r1_,_r2_):caml_call_gen(_r0_,[_r1_,_r2_]);}
    function _cL_(_rY_,_rZ_)
     {return _rY_.length==1?_rY_(_rZ_):caml_call_gen(_rY_,[_rZ_]);}
    var
     _a_=[0,new MlString("Failure")],
     _b_=[0,new MlString("Invalid_argument")],
     _c_=[0,new MlString("Not_found")],
     _d_=[0,0,0],
     _e_=[0,0,0,255,1],
     match_f_=[0,3e3,1e3];
    caml_register_global(6,_c_);
    caml_register_global(5,[0,new MlString("Division_by_zero")]);
    caml_register_global(3,_b_);
    caml_register_global(2,_a_);
    var
     _bR_=[0,new MlString("Assert_failure")],
     _bQ_=new MlString("%d"),
     _bP_=new MlString("true"),
     _bO_=new MlString("false"),
     _bN_=new MlString("Pervasives.do_at_exit"),
     _bM_=new MlString("\\b"),
     _bL_=new MlString("\\t"),
     _bK_=new MlString("\\n"),
     _bJ_=new MlString("\\r"),
     _bI_=new MlString("\\\\"),
     _bH_=new MlString("\\'"),
     _bG_=new MlString("String.blit"),
     _bF_=new MlString("String.sub"),
     _bE_=new MlString("Buffer.add: cannot grow buffer"),
     _bD_=new MlString(""),
     _bC_=new MlString(""),
     _bB_=new MlString("%.12g"),
     _bA_=new MlString("\""),
     _bz_=new MlString("\""),
     _by_=new MlString("'"),
     _bx_=new MlString("'"),
     _bw_=new MlString("nan"),
     _bv_=new MlString("neg_infinity"),
     _bu_=new MlString("infinity"),
     _bt_=new MlString("."),
     _bs_=new MlString("printf: bad positional specification (0)."),
     _br_=new MlString("%_"),
     _bq_=[0,new MlString("printf.ml"),143,8],
     _bp_=new MlString("'"),
     _bo_=new MlString("Printf: premature end of format string '"),
     _bn_=new MlString("'"),
     _bm_=new MlString(" in format string '"),
     _bl_=new MlString(", at char number "),
     _bk_=new MlString("Printf: bad conversion %"),
     _bj_=new MlString("Sformat.index_of_int: negative argument "),
     _bi_=new MlString("Random.int"),
     _bh_=
      [0,
       987910699,
       495797812,
       364182224,
       414272206,
       318284740,
       990407751,
       383018966,
       270373319,
       840823159,
       24560019,
       536292337,
       512266505,
       189156120,
       730249596,
       143776328,
       51606627,
       140166561,
       366354223,
       1003410265,
       700563762,
       981890670,
       913149062,
       526082594,
       1021425055,
       784300257,
       667753350,
       630144451,
       949649812,
       48546892,
       415514493,
       258888527,
       511570777,
       89983870,
       283659902,
       308386020,
       242688715,
       482270760,
       865188196,
       1027664170,
       207196989,
       193777847,
       619708188,
       671350186,
       149669678,
       257044018,
       87658204,
       558145612,
       183450813,
       28133145,
       901332182,
       710253903,
       510646120,
       652377910,
       409934019,
       801085050],
     _bg_=new MlString("\\$&"),
     _bf_=new MlString("g"),
     _be_=new MlString("g"),
     _bd_=new MlString("[$]"),
     _bc_=new MlString("[\\][()\\\\|+*.?{}^$]"),
     _bb_=[0,new MlString(""),0],
     _ba_=new MlString(""),
     _a$_=new MlString(" "),
     _a__=new MlString("Url.Local_exn"),
     _a9_=new MlString("+"),
     _a8_=new MlString("g"),
     _a7_=new MlString("\\+"),
     _a6_=
      new
       MlString
       ("^([Hh][Tt][Tt][Pp][Ss]?)://([0-9a-zA-Z.-]+|\\[[0-9a-zA-Z.-]+\\]|\\[[0-9A-Fa-f:.]+\\])?(:([0-9]+))?/([^\\?#]*)(\\?([^#]*))?(#(.*))?$"),
     _a5_=
      new MlString("^([Ff][Ii][Ll][Ee])://([^\\?#]*)(\\?([^#]*))?(#(.*))?$"),
     _a4_=new MlString("Option.value_exn: None"),
     _a3_=
      new
       MlString
       ("(function(a,f){var len=a.length;for(var i = 0; i < len; ++i){f(a[i]);}})"),
     _a2_=new MlString(""),
     _a1_=new MlString("iter"),
     _a0_=
      new
       MlString
       ("(function(t, x0, f){for(var k in t){if(t.hasOwnProperty(k)){x0=f(x0,parseInt(k),t[k]);}} return x0;})"),
     _aZ_=
      new
       MlString
       ("(function(t, f){for(var k in t){if(t.hasOwnProperty(k)){f(parseInt(k),t[k]);}}})"),
     _aY_=new MlString("(function(x,y){return x % y;})"),
     _aX_=
      new MlString("Stream.turn_on_derived: Listener was not off or passive"),
     _aW_=new MlString("Stream.turn_off_derived: Listener was not on"),
     _aV_=new MlString("Stream.Prim.turn_off: Listener was not on or passive"),
     _aU_=new MlString("Stream.Prim.turn_on: Listener was not off or passive"),
     _aT_=new MlString("pageY"),
     _aS_=new MlString("pageX"),
     _aR_=new MlString("mousemove"),
     _aQ_=new MlString("which"),
     _aP_=new MlString("keyup"),
     _aO_=new MlString("keydown"),
     _aN_=new MlString("http://www.w3.org/2000/svg"),
     _aM_=new MlString("removal"),
     _aL_=new MlString("top"),
     _aK_=new MlString("left"),
     _aJ_=new MlString("body"),
     _aI_=new MlString("height"),
     _aH_=new MlString("width"),
     _aG_=new MlString("svg"),
     _aF_=new MlString("M%f,%f %s"),
     _aE_=new MlString("circle"),
     _aD_=new MlString("style"),
     _aC_=new MlString("r"),
     _aB_=new MlString("cy"),
     _aA_=new MlString("cx"),
     _az_=new MlString("transform"),
     _ay_=[0,new MlString(",")],
     _ax_=new MlString("points"),
     _aw_=new MlString("style"),
     _av_=new MlString("polygon"),
     _au_=new MlString("points"),
     _at_=new MlString("path"),
     _as_=new MlString("d"),
     _ar_=new MlString("path"),
     _aq_=new MlString("d"),
     _ap_=new MlString("text"),
     _ao_=new MlString("style"),
     _an_=new MlString("y"),
     _am_=new MlString("x"),
     _al_=new MlString("style"),
     _ak_=new MlString("height"),
     _aj_=new MlString("width"),
     _ai_=new MlString("y"),
     _ah_=new MlString("x"),
     _ag_=new MlString("rect"),
     _af_=new MlString("height"),
     _ae_=new MlString("width"),
     _ad_=new MlString("y"),
     _ac_=new MlString("x"),
     _ab_=new MlString("g"),
     _aa_=new MlString("image"),
     _$_=new MlString("height"),
     ___=new MlString("width"),
     _Z_=new MlString("xlink:href"),
     _Y_=new MlString("g"),
     _X_=new MlString("px"),
     _W_=new MlString("style"),
     _V_=[0,new MlString(";")],
     _U_=[0,new MlString(" ")],
     _T_=new MlString("L%f %f"),
     _S_=new MlString("M%f %f"),
     _R_=new MlString("A%f,%f 0 %d,%d %f,%f"),
     _Q_=new MlString("a%f,%f 0 %d,1 %f,%f"),
     _P_=new MlString("fill:"),
     _O_=new MlString("stroke-linejoin:"),
     _N_=new MlString("stroke-linecap:"),
     _M_=new MlString("stroke-width:"),
     _L_=new MlString("stroke:"),
     _K_=[0,new MlString(";")],
     _J_=[0,new MlString(" ")],
     _I_=new MlString("stroke-dasharray:"),
     _H_=new MlString("%s:%s"),
     _G_=new MlString("miter"),
     _F_=new MlString("bevel"),
     _E_=new MlString("round"),
     _D_=new MlString("butt"),
     _C_=new MlString("round"),
     _B_=new MlString("square"),
     _A_=[0,new MlString(" ")],
     _z_=new MlString("matrix(%f,%f,%f,%f,%f,%f)"),
     _y_=new MlString("translate(%f %f)"),
     _x_=new MlString("scale(%f %f)"),
     _w_=new MlString("rotate(%f %f %f)"),
     _v_=new MlString("skewX(%f)"),
     _u_=new MlString("skewY(%f)"),
     _t_=new MlString("rgba(%d,%d,%d,%f)"),
     _s_=[0,new MlString(" ")],
     _r_=new MlString(","),
     _q_=[0,0,0,0,1],
     _p_=[0,0,0],
     _o_=[0,0,0],
     _n_=[0,1,-1],
     _m_=new MlString("#circles"),
     _l_=[0,600,450],
     _k_=[0,350,360],
     _j_=[0,400,170];
    /*<<990: pervasives.ml 20 17 33>>*/function _i_(s_g_){throw [0,_a_,s_g_];}
    /*<<984: pervasives.ml 21 20 45>>*/function _bS_(s_h_)
     {throw [0,_b_,s_h_];}
    function _b3_(s1_bT_,s2_bV_)
     {var
       l1_bU_=s1_bT_.getLen(),
       l2_bW_=s2_bV_.getLen(),
       s_bX_=caml_create_string(l1_bU_+l2_bW_|0);
      caml_blit_string(s1_bT_,0,s_bX_,0,l1_bU_);
      caml_blit_string(s2_bV_,0,s_bX_,l1_bU_,l2_bW_);
      return s_bX_;}
    /*<<846: pervasives.ml 186 2 19>>*/function string_of_int_b4_(n_bY_)
     {return caml_format_int(_bQ_,n_bY_);}
    /*<<220: pervasives.ml 451 20 39>>*/function do_at_exit_b5_(param_b2_)
     {var param_bZ_=caml_ml_out_channels_list(0);
      /*<<720: pervasives.ml 253 17 50>>*/for(;;)
       {if(param_bZ_)
         {var l_b0_=param_bZ_[2];
          try {}catch(_b1_){}
          var param_bZ_=l_b0_;
          continue;}
        return 0;}}
    caml_register_named_value(_bN_,do_at_exit_b5_);
    function _cg_(n_b6_,c_b8_)
     {var s_b7_=caml_create_string(n_b6_);
      caml_fill_string(s_b7_,0,n_b6_,c_b8_);
      return s_b7_;}
    function _ch_(s_b$_,ofs_b9_,len_b__)
     {if(0<=ofs_b9_&&0<=len_b__&&!((s_b$_.getLen()-len_b__|0)<ofs_b9_))
       {var r_ca_=caml_create_string(len_b__);
        /*<<6675: string.ml 41 7 5>>*/caml_blit_string
         (s_b$_,ofs_b9_,r_ca_,0,len_b__);
        return r_ca_;}
      return _bS_(_bF_);}
    function _ci_(s1_cd_,ofs1_cc_,s2_cf_,ofs2_ce_,len_cb_)
     {if
       (0<=
        len_cb_&&
        0<=
        ofs1_cc_&&
        !((s1_cd_.getLen()-len_cb_|0)<ofs1_cc_)&&
        0<=
        ofs2_ce_&&
        !((s2_cf_.getLen()-len_cb_|0)<ofs2_ce_))
       return caml_blit_string(s1_cd_,ofs1_cc_,s2_cf_,ofs2_ce_,len_cb_);
      return _bS_(_bG_);}
    var
     _cj_=caml_sys_const_word_size(0),
     _ck_=caml_mul(_cj_/8|0,(1<<(_cj_-10|0))-1|0)-1|0;
    /*<<11355: buffer.ml 23 1 59>>*/function _cC_(n_cl_)
     {var
       n_cm_=1<=n_cl_?n_cl_:1,
       n_cn_=_ck_<n_cm_?_ck_:n_cm_,
       s_co_=caml_create_string(n_cn_);
      return [0,s_co_,0,n_cn_,s_co_];}
    /*<<11345: buffer.ml 28 17 49>>*/function _cD_(b_cp_)
     {return _ch_(b_cp_[1],0,b_cp_[2]);}
    function _cw_(b_cq_,more_cs_)
     {var new_len_cr_=[0,b_cq_[3]];
      for(;;)
       {if(new_len_cr_[1]<(b_cq_[2]+more_cs_|0))
         {new_len_cr_[1]=2*new_len_cr_[1]|0;continue;}
        if(_ck_<new_len_cr_[1])
         if((b_cq_[2]+more_cs_|0)<=_ck_)
          /*<<11153: buffer.ml 68 9 41>>*/new_len_cr_[1]=_ck_;
         else
          /*<<11160: buffer.ml 69 9 50>>*/_i_(_bE_);
        var new_buffer_ct_=caml_create_string(new_len_cr_[1]);
        /*<<11166: buffer.ml 69 9 50>>*/_ci_
         (b_cq_[1],0,new_buffer_ct_,0,b_cq_[2]);
        /*<<11166: buffer.ml 69 9 50>>*/b_cq_[1]=new_buffer_ct_;
        /*<<11166: buffer.ml 69 9 50>>*/b_cq_[3]=new_len_cr_[1];
        return 0;}}
    function _cE_(b_cu_,c_cx_)
     {var pos_cv_=b_cu_[2];
      if(b_cu_[3]<=pos_cv_)/*<<11090: buffer.ml 78 26 36>>*/_cw_(b_cu_,1);
      /*<<11094: buffer.ml 78 26 36>>*/b_cu_[1].safeSet(pos_cv_,c_cx_);
      /*<<11094: buffer.ml 78 26 36>>*/b_cu_[2]=pos_cv_+1|0;
      return 0;}
    function _cF_(b_cA_,s_cy_)
     {var len_cz_=s_cy_.getLen(),new_position_cB_=b_cA_[2]+len_cz_|0;
      if(b_cA_[3]<new_position_cB_)
       /*<<10992: buffer.ml 93 34 46>>*/_cw_(b_cA_,len_cz_);
      /*<<10996: buffer.ml 93 34 46>>*/_ci_(s_cy_,0,b_cA_[1],b_cA_[2],len_cz_);
      /*<<10996: buffer.ml 93 34 46>>*/b_cA_[2]=new_position_cB_;
      return 0;}
    /*<<15034: printf.ml 32 4 80>>*/function index_of_int_cJ_(i_cG_)
     {return 0<=i_cG_?i_cG_:_i_(_b3_(_bj_,string_of_int_b4_(i_cG_)));}
    function add_int_index_cK_(i_cH_,idx_cI_)
     {return index_of_int_cJ_(i_cH_+idx_cI_|0);}
    var _cM_=_cL_(add_int_index_cK_,1);
    /*<<15000: printf.ml 58 22 66>>*/function _cT_(fmt_cN_)
     {return _ch_(fmt_cN_,0,fmt_cN_.getLen());}
    function bad_conversion_cV_(sfmt_cO_,i_cP_,c_cR_)
     {var
       _cQ_=_b3_(_bm_,_b3_(sfmt_cO_,_bn_)),
       _cS_=_b3_(_bl_,_b3_(string_of_int_b4_(i_cP_),_cQ_));
      return _bS_(_b3_(_bk_,_b3_(_cg_(1,c_cR_),_cS_)));}
    function bad_conversion_format_dO_(fmt_cU_,i_cX_,c_cW_)
     {return bad_conversion_cV_(_cT_(fmt_cU_),i_cX_,c_cW_);}
    /*<<14913: printf.ml 75 2 34>>*/function incomplete_format_dP_(fmt_cY_)
     {return _bS_(_b3_(_bo_,_b3_(_cT_(fmt_cY_),_bp_)));}
    function extract_format_dk_(fmt_cZ_,start_c7_,stop_c9_,widths_c$_)
     {/*<<14645: printf.ml 123 4 16>>*/function skip_positional_spec_c6_
       (start_c0_)
       {if
         ((fmt_cZ_.safeGet(start_c0_)-48|0)<
          0||
          9<
          (fmt_cZ_.safeGet(start_c0_)-48|0))
         return start_c0_;
        var i_c1_=start_c0_+1|0;
        /*<<14616: printf.ml 126 8 20>>*/for(;;)
         {var _c2_=fmt_cZ_.safeGet(i_c1_);
          if(48<=_c2_)
           {if(!(58<=_c2_)){var _c4_=i_c1_+1|0,i_c1_=_c4_;continue;}
            var _c3_=0;}
          else
           if(36===_c2_){var _c5_=i_c1_+1|0,_c3_=1;}else var _c3_=0;
          if(!_c3_)var _c5_=start_c0_;
          return _c5_;}}
      var
       start_c8_=skip_positional_spec_c6_(start_c7_+1|0),
       b_c__=_cC_((stop_c9_-start_c8_|0)+10|0);
      _cE_(b_c__,37);
      var l1_da_=widths_c$_,l2_db_=0;
      for(;;)
       {if(l1_da_)
         {var
           l_dc_=l1_da_[2],
           _dd_=[0,l1_da_[1],l2_db_],
           l1_da_=l_dc_,
           l2_db_=_dd_;
          continue;}
        var i_de_=start_c8_,widths_df_=l2_db_;
        for(;;)
         {if(i_de_<=stop_c9_)
           {var _dg_=fmt_cZ_.safeGet(i_de_);
            if(42===_dg_)
             {if(widths_df_)
               {var t_dh_=widths_df_[2];
                _cF_(b_c__,string_of_int_b4_(widths_df_[1]));
                var
                 i_di_=skip_positional_spec_c6_(i_de_+1|0),
                 i_de_=i_di_,
                 widths_df_=t_dh_;
                continue;}
              throw [0,_bR_,_bq_];}
            _cE_(b_c__,_dg_);
            var _dj_=i_de_+1|0,i_de_=_dj_;
            continue;}
          return _cD_(b_c__);}}}
    function extract_format_int_fe_
     (conv_dq_,fmt_do_,start_dn_,stop_dm_,widths_dl_)
     {var sfmt_dp_=extract_format_dk_(fmt_do_,start_dn_,stop_dm_,widths_dl_);
      if(78!==conv_dq_&&110!==conv_dq_)return sfmt_dp_;
      /*<<14534: printf.ml 155 4 8>>*/sfmt_dp_.safeSet
       (sfmt_dp_.getLen()-1|0,117);
      return sfmt_dp_;}
    function sub_format_dQ_
     (incomplete_format_dx_,bad_conversion_format_dH_,conv_dM_,fmt_dr_,i_dL_)
     {var len_ds_=fmt_dr_.getLen();
      function sub_fmt_dJ_(c_dt_,i_dG_)
       {var close_du_=40===c_dt_?41:125;
        /*<<14299: printf.ml 181 7 26>>*/function sub_dF_(j_dv_)
         {var j_dw_=j_dv_;
          /*<<14299: printf.ml 181 7 26>>*/for(;;)
           {if(len_ds_<=j_dw_)return _cL_(incomplete_format_dx_,fmt_dr_);
            if(37===fmt_dr_.safeGet(j_dw_))
             {var _dy_=j_dw_+1|0;
              if(len_ds_<=_dy_)
               var _dz_=_cL_(incomplete_format_dx_,fmt_dr_);
              else
               {var _dA_=fmt_dr_.safeGet(_dy_),_dB_=_dA_-40|0;
                if(_dB_<0||1<_dB_)
                 {var _dC_=_dB_-83|0;
                  if(_dC_<0||2<_dC_)
                   var _dD_=1;
                  else
                   switch(_dC_)
                    {case 1:var _dD_=1;break;
                     case 2:var _dE_=1,_dD_=0;break;
                     default:var _dE_=0,_dD_=0;}
                  if(_dD_){var _dz_=sub_dF_(_dy_+1|0),_dE_=2;}}
                else
                 var _dE_=0===_dB_?0:1;
                switch(_dE_)
                 {case 1:
                   var
                    _dz_=
                     _dA_===close_du_
                      ?_dy_+1|0
                      :_dI_(bad_conversion_format_dH_,fmt_dr_,i_dG_,_dA_);
                   break;
                  case 2:break;
                  default:var _dz_=sub_dF_(sub_fmt_dJ_(_dA_,_dy_+1|0)+1|0);}}
              return _dz_;}
            var _dK_=j_dw_+1|0,j_dw_=_dK_;
            continue;}}
        return sub_dF_(i_dG_);}
      return sub_fmt_dJ_(conv_dM_,i_dL_);}
    /*<<14293: printf.ml 199 2 57>>*/function sub_format_for_printf_ee_
     (conv_dN_)
     {return _dI_
              (sub_format_dQ_,
               incomplete_format_dP_,
               bad_conversion_format_dO_,
               conv_dN_);}
    function iter_on_format_args_eu_(fmt_dR_,add_conv_d2_,add_char_ea_)
     {var lim_dS_=fmt_dR_.getLen()-1|0;
      /*<<14233: printf.ml 254 4 10>>*/function scan_fmt_ec_(i_dT_)
       {var i_dU_=i_dT_;
        a:
        /*<<14233: printf.ml 254 4 10>>*/for(;;)
         {if(i_dU_<lim_dS_)
           {if(37===fmt_dR_.safeGet(i_dU_))
             {var skip_dV_=0,i_dW_=i_dU_+1|0;
              for(;;)
               {if(lim_dS_<i_dW_)
                 var _dX_=incomplete_format_dP_(fmt_dR_);
                else
                 {var _dY_=fmt_dR_.safeGet(i_dW_);
                  if(58<=_dY_)
                   {if(95===_dY_)
                     {var _d0_=i_dW_+1|0,_dZ_=1,skip_dV_=_dZ_,i_dW_=_d0_;
                      continue;}}
                  else
                   if(32<=_dY_)
                    switch(_dY_-32|0)
                     {case 1:
                      case 2:
                      case 4:
                      case 5:
                      case 6:
                      case 7:
                      case 8:
                      case 9:
                      case 12:
                      case 15:break;
                      case 0:
                      case 3:
                      case 11:
                      case 13:var _d1_=i_dW_+1|0,i_dW_=_d1_;continue;
                      case 10:
                       var _d3_=_dI_(add_conv_d2_,skip_dV_,i_dW_,105),i_dW_=_d3_;
                       continue;
                      default:var _d4_=i_dW_+1|0,i_dW_=_d4_;continue;}
                  var i_d5_=i_dW_;
                  c:
                  for(;;)
                   {if(lim_dS_<i_d5_)
                     var _d6_=incomplete_format_dP_(fmt_dR_);
                    else
                     {var _d7_=fmt_dR_.safeGet(i_d5_);
                      if(126<=_d7_)
                       var _d8_=0;
                      else
                       switch(_d7_)
                        {case 78:
                         case 88:
                         case 100:
                         case 105:
                         case 111:
                         case 117:
                         case 120:
                          var _d6_=_dI_(add_conv_d2_,skip_dV_,i_d5_,105),_d8_=1;break;
                         case 69:
                         case 70:
                         case 71:
                         case 101:
                         case 102:
                         case 103:
                          var _d6_=_dI_(add_conv_d2_,skip_dV_,i_d5_,102),_d8_=1;break;
                         case 33:
                         case 37:
                         case 44:
                         case 64:var _d6_=i_d5_+1|0,_d8_=1;break;
                         case 83:
                         case 91:
                         case 115:
                          var _d6_=_dI_(add_conv_d2_,skip_dV_,i_d5_,115),_d8_=1;break;
                         case 97:
                         case 114:
                         case 116:
                          var _d6_=_dI_(add_conv_d2_,skip_dV_,i_d5_,_d7_),_d8_=1;
                          break;
                         case 76:
                         case 108:
                         case 110:
                          var j_d9_=i_d5_+1|0;
                          if(lim_dS_<j_d9_)
                           {var _d6_=_dI_(add_conv_d2_,skip_dV_,i_d5_,105),_d8_=1;}
                          else
                           {var _d__=fmt_dR_.safeGet(j_d9_)-88|0;
                            if(_d__<0||32<_d__)
                             var _d$_=1;
                            else
                             switch(_d__)
                              {case 0:
                               case 12:
                               case 17:
                               case 23:
                               case 29:
                               case 32:
                                var
                                 _d6_=
                                  _eb_
                                   (add_char_ea_,_dI_(add_conv_d2_,skip_dV_,i_d5_,_d7_),105),
                                 _d8_=1,
                                 _d$_=0;
                                break;
                               default:var _d$_=1;}
                            if(_d$_)
                             {var _d6_=_dI_(add_conv_d2_,skip_dV_,i_d5_,105),_d8_=1;}}
                          break;
                         case 67:
                         case 99:
                          var _d6_=_dI_(add_conv_d2_,skip_dV_,i_d5_,99),_d8_=1;break;
                         case 66:
                         case 98:
                          var _d6_=_dI_(add_conv_d2_,skip_dV_,i_d5_,66),_d8_=1;break;
                         case 41:
                         case 125:
                          var _d6_=_dI_(add_conv_d2_,skip_dV_,i_d5_,_d7_),_d8_=1;
                          break;
                         case 40:
                          var
                           _d6_=scan_fmt_ec_(_dI_(add_conv_d2_,skip_dV_,i_d5_,_d7_)),
                           _d8_=1;
                          break;
                         case 123:
                          var
                           i_ed_=_dI_(add_conv_d2_,skip_dV_,i_d5_,_d7_),
                           j_ef_=_dI_(sub_format_for_printf_ee_,_d7_,fmt_dR_,i_ed_),
                           i_eg_=i_ed_;
                          /*<<13855: printf.ml 240 8 63>>*/for(;;)
                           {if(i_eg_<(j_ef_-2|0))
                             {var
                               _eh_=_eb_(add_char_ea_,i_eg_,fmt_dR_.safeGet(i_eg_)),
                               i_eg_=_eh_;
                              continue;}
                            var _ei_=j_ef_-1|0,i_d5_=_ei_;
                            continue c;}
                         default:var _d8_=0;}
                      if(!_d8_)
                       var _d6_=bad_conversion_format_dO_(fmt_dR_,i_d5_,_d7_);}
                    var _dX_=_d6_;
                    break;}}
                var i_dU_=_dX_;
                continue a;}}
            var _ej_=i_dU_+1|0,i_dU_=_ej_;
            continue;}
          return i_dU_;}}
      scan_fmt_ec_(0);
      return 0;}
    /*<<13568: printf.ml 310 2 12>>*/function
     count_printing_arguments_of_format_gt_
     (fmt_ev_)
     {var ac_ek_=[0,0,0,0];
      function add_conv_et_(skip_ep_,i_eq_,c_el_)
       {var _em_=41!==c_el_?1:0,_en_=_em_?125!==c_el_?1:0:_em_;
        if(_en_)
         {var inc_eo_=97===c_el_?2:1;
          if(114===c_el_)
           /*<<13624: printf.ml 295 20 48>>*/ac_ek_[3]=ac_ek_[3]+1|0;
          if(skip_ep_)
           /*<<13633: printf.ml 297 9 39>>*/ac_ek_[2]=ac_ek_[2]+inc_eo_|0;
          else
           /*<<13641: printf.ml 298 9 39>>*/ac_ek_[1]=ac_ek_[1]+inc_eo_|0;}
        return i_eq_+1|0;}
      /*<<13649: printf.ml 292 2 4>>*/iter_on_format_args_eu_
       (fmt_ev_,add_conv_et_,function(i_er_,param_es_){return i_er_+1|0;});
      return ac_ek_[1];}
    function scan_positional_spec_fa_(fmt_ew_,got_spec_ez_,i_ex_)
     {var _ey_=fmt_ew_.safeGet(i_ex_);
      if((_ey_-48|0)<0||9<(_ey_-48|0))return _eb_(got_spec_ez_,0,i_ex_);
      var accu_eA_=_ey_-48|0,j_eB_=i_ex_+1|0;
      for(;;)
       {var _eC_=fmt_ew_.safeGet(j_eB_);
        if(48<=_eC_)
         {if(!(58<=_eC_))
           {var
             _eF_=j_eB_+1|0,
             _eE_=(10*accu_eA_|0)+(_eC_-48|0)|0,
             accu_eA_=_eE_,
             j_eB_=_eF_;
            continue;}
          var _eD_=0;}
        else
         if(36===_eC_)
          if(0===accu_eA_)
           {var _eG_=_i_(_bs_),_eD_=1;}
          else
           {var
             _eG_=
              _eb_(got_spec_ez_,[0,index_of_int_cJ_(accu_eA_-1|0)],j_eB_+1|0),
             _eD_=1;}
         else
          var _eD_=0;
        if(!_eD_)var _eG_=_eb_(got_spec_ez_,0,i_ex_);
        return _eG_;}}
    function next_index_e7_(spec_eH_,n_eI_)
     {return spec_eH_?n_eI_:_cL_(_cM_,n_eI_);}
    function get_index_eW_(spec_eJ_,n_eK_){return spec_eJ_?spec_eJ_[1]:n_eK_;}
    function _hV_
     (to_s_gO_,get_out_eM_,outc_g0_,outs_eP_,flush_gy_,k_g6_,fmt_eL_)
     {var out_eN_=_cL_(get_out_eM_,fmt_eL_);
      /*<<11901: printf.ml 615 15 25>>*/function outs_gP_(s_eO_)
       {return _eb_(outs_eP_,out_eN_,s_eO_);}
      function pr_gx_(k_eU_,n_g5_,fmt_eQ_,v_eZ_)
       {var len_eT_=fmt_eQ_.getLen();
        function doprn_gu_(n_gX_,i_eR_)
         {var i_eS_=i_eR_;
          for(;;)
           {if(len_eT_<=i_eS_)return _cL_(k_eU_,out_eN_);
            var _eV_=fmt_eQ_.safeGet(i_eS_);
            if(37===_eV_)
             {var
               get_arg_e3_=
                function(spec_eY_,n_eX_)
                 {return caml_array_get(v_eZ_,get_index_eW_(spec_eY_,n_eX_));},
               scan_flags_e9_=
                function(spec_e$_,n_e4_,widths_e6_,i_e0_)
                 {var i_e1_=i_e0_;
                  for(;;)
                   {var _e2_=fmt_eQ_.safeGet(i_e1_)-32|0;
                    if(!(_e2_<0||25<_e2_))
                     switch(_e2_)
                      {case 1:
                       case 2:
                       case 4:
                       case 5:
                       case 6:
                       case 7:
                       case 8:
                       case 9:
                       case 12:
                       case 15:break;
                       case 10:
                        return scan_positional_spec_fa_
                                (fmt_eQ_,
                                 function(wspec_e5_,i_e__)
                                  {var _e8_=[0,get_arg_e3_(wspec_e5_,n_e4_),widths_e6_];
                                   return scan_flags_e9_
                                           (spec_e$_,next_index_e7_(wspec_e5_,n_e4_),_e8_,i_e__);},
                                 i_e1_+1|0);
                       default:var _fb_=i_e1_+1|0,i_e1_=_fb_;continue;}
                    var _fc_=fmt_eQ_.safeGet(i_e1_);
                    if(124<=_fc_)
                     var _fd_=0;
                    else
                     switch(_fc_)
                      {case 78:
                       case 88:
                       case 100:
                       case 105:
                       case 111:
                       case 117:
                       case 120:
                        var
                         x_ff_=get_arg_e3_(spec_e$_,n_e4_),
                         s_fg_=
                          caml_format_int
                           (extract_format_int_fe_(_fc_,fmt_eQ_,i_eS_,i_e1_,widths_e6_),
                            x_ff_),
                         _fi_=
                          cont_s_fh_(next_index_e7_(spec_e$_,n_e4_),s_fg_,i_e1_+1|0),
                         _fd_=1;
                        break;
                       case 69:
                       case 71:
                       case 101:
                       case 102:
                       case 103:
                        var
                         x_fj_=get_arg_e3_(spec_e$_,n_e4_),
                         s_fk_=
                          caml_format_float
                           (extract_format_dk_(fmt_eQ_,i_eS_,i_e1_,widths_e6_),x_fj_),
                         _fi_=
                          cont_s_fh_(next_index_e7_(spec_e$_,n_e4_),s_fk_,i_e1_+1|0),
                         _fd_=1;
                        break;
                       case 76:
                       case 108:
                       case 110:
                        var _fl_=fmt_eQ_.safeGet(i_e1_+1|0)-88|0;
                        if(_fl_<0||32<_fl_)
                         var _fm_=1;
                        else
                         switch(_fl_)
                          {case 0:
                           case 12:
                           case 17:
                           case 23:
                           case 29:
                           case 32:
                            var i_fn_=i_e1_+1|0,_fo_=_fc_-108|0;
                            if(_fo_<0||2<_fo_)
                             var _fp_=0;
                            else
                             {switch(_fo_)
                               {case 1:var _fp_=0,_fq_=0;break;
                                case 2:
                                 var
                                  x_fr_=get_arg_e3_(spec_e$_,n_e4_),
                                  _fs_=
                                   caml_format_int
                                    (extract_format_dk_(fmt_eQ_,i_eS_,i_fn_,widths_e6_),x_fr_),
                                  _fq_=1;
                                 break;
                                default:
                                 var
                                  x_ft_=get_arg_e3_(spec_e$_,n_e4_),
                                  _fs_=
                                   caml_format_int
                                    (extract_format_dk_(fmt_eQ_,i_eS_,i_fn_,widths_e6_),x_ft_),
                                  _fq_=1;}
                              if(_fq_){var s_fu_=_fs_,_fp_=1;}}
                            if(!_fp_)
                             {var
                               x_fv_=get_arg_e3_(spec_e$_,n_e4_),
                               s_fu_=
                                caml_int64_format
                                 (extract_format_dk_(fmt_eQ_,i_eS_,i_fn_,widths_e6_),x_fv_);}
                            var
                             _fi_=
                              cont_s_fh_(next_index_e7_(spec_e$_,n_e4_),s_fu_,i_fn_+1|0),
                             _fd_=1,
                             _fm_=0;
                            break;
                           default:var _fm_=1;}
                        if(_fm_)
                         {var
                           x_fw_=get_arg_e3_(spec_e$_,n_e4_),
                           s_fx_=
                            caml_format_int
                             (extract_format_int_fe_(110,fmt_eQ_,i_eS_,i_e1_,widths_e6_),
                              x_fw_),
                           _fi_=
                            cont_s_fh_(next_index_e7_(spec_e$_,n_e4_),s_fx_,i_e1_+1|0),
                           _fd_=1;}
                        break;
                       case 37:
                       case 64:
                        var _fi_=cont_s_fh_(n_e4_,_cg_(1,_fc_),i_e1_+1|0),_fd_=1;
                        break;
                       case 83:
                       case 115:
                        var x_fy_=get_arg_e3_(spec_e$_,n_e4_);
                        if(115===_fc_)
                         var x_fz_=x_fy_;
                        else
                         {var n_fA_=[0,0],_fB_=0,_fC_=x_fy_.getLen()-1|0;
                          if(!(_fC_<_fB_))
                           {var i_fD_=_fB_;
                            for(;;)
                             {var
                               _fE_=x_fy_.safeGet(i_fD_),
                               _fF_=
                                14<=_fE_
                                 ?34===_fE_?1:92===_fE_?1:0
                                 :11<=_fE_?13<=_fE_?1:0:8<=_fE_?1:0,
                               _fG_=_fF_?2:caml_is_printable(_fE_)?1:4;
                              n_fA_[1]=n_fA_[1]+_fG_|0;
                              var _fH_=i_fD_+1|0;
                              if(_fC_!==i_fD_){var i_fD_=_fH_;continue;}
                              break;}}
                          if(n_fA_[1]===x_fy_.getLen())
                           var _fI_=x_fy_;
                          else
                           {var s__fJ_=caml_create_string(n_fA_[1]);
                            /*<<5987: string.ml 115 33 9>>*/n_fA_[1]=0;
                            var _fK_=0,_fL_=x_fy_.getLen()-1|0;
                            if(!(_fL_<_fK_))
                             {var i_fM_=_fK_;
                              for(;;)
                               {var _fN_=x_fy_.safeGet(i_fM_),_fO_=_fN_-34|0;
                                if(_fO_<0||58<_fO_)
                                 if(-20<=_fO_)
                                  var _fP_=1;
                                 else
                                  {switch(_fO_+34|0)
                                    {case 8:
                                      /*<<6079: string.ml 130 16 67>>*/s__fJ_.safeSet(n_fA_[1],92);
                                      /*<<6079: string.ml 130 16 67>>*/n_fA_[1]+=1;
                                      /*<<6079: string.ml 130 16 67>>*/s__fJ_.safeSet(n_fA_[1],98);
                                      var _fQ_=1;
                                      break;
                                     case 9:
                                      /*<<6096: string.ml 126 16 67>>*/s__fJ_.safeSet(n_fA_[1],92);
                                      /*<<6096: string.ml 126 16 67>>*/n_fA_[1]+=1;
                                      /*<<6096: string.ml 126 16 67>>*/s__fJ_.safeSet
                                       (n_fA_[1],116);
                                      var _fQ_=1;
                                      break;
                                     case 10:
                                      /*<<6113: string.ml 124 16 67>>*/s__fJ_.safeSet(n_fA_[1],92);
                                      /*<<6113: string.ml 124 16 67>>*/n_fA_[1]+=1;
                                      /*<<6113: string.ml 124 16 67>>*/s__fJ_.safeSet
                                       (n_fA_[1],110);
                                      var _fQ_=1;
                                      break;
                                     case 13:
                                      /*<<6130: string.ml 128 16 67>>*/s__fJ_.safeSet(n_fA_[1],92);
                                      /*<<6130: string.ml 128 16 67>>*/n_fA_[1]+=1;
                                      /*<<6130: string.ml 128 16 67>>*/s__fJ_.safeSet
                                       (n_fA_[1],114);
                                      var _fQ_=1;
                                      break;
                                     default:var _fP_=1,_fQ_=0;}
                                   if(_fQ_)var _fP_=0;}
                                else
                                 var
                                  _fP_=
                                   (_fO_-1|0)<0||56<(_fO_-1|0)
                                    ?(s__fJ_.safeSet(n_fA_[1],92),
                                      n_fA_[1]+=
                                      1,
                                      s__fJ_.safeSet(n_fA_[1],_fN_),
                                      0)
                                    :1;
                                if(_fP_)
                                 if(caml_is_printable(_fN_))
                                  /*<<6159: string.ml 133 18 36>>*/s__fJ_.safeSet
                                   (n_fA_[1],_fN_);
                                 else
                                  {/*<<6166: string.ml 134 21 19>>*/s__fJ_.safeSet
                                    (n_fA_[1],92);
                                   /*<<6166: string.ml 134 21 19>>*/n_fA_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fJ_.safeSet
                                    (n_fA_[1],48+(_fN_/100|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fA_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fJ_.safeSet
                                    (n_fA_[1],48+((_fN_/10|0)%10|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fA_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fJ_.safeSet
                                    (n_fA_[1],48+(_fN_%10|0)|0);}
                                n_fA_[1]+=1;
                                var _fR_=i_fM_+1|0;
                                if(_fL_!==i_fM_){var i_fM_=_fR_;continue;}
                                break;}}
                            var _fI_=s__fJ_;}
                          var x_fz_=_b3_(_bz_,_b3_(_fI_,_bA_));}
                        if(i_e1_===(i_eS_+1|0))
                         var s_fS_=x_fz_;
                        else
                         {var
                           _fT_=
                            extract_format_dk_(fmt_eQ_,i_eS_,i_e1_,widths_e6_);
                          /*<<14883: printf.ml 83 2 42>>*/try
                           {var neg_fU_=0,i_fV_=1;
                            for(;;)
                             {if(_fT_.getLen()<=i_fV_)
                               var _fW_=[0,0,neg_fU_];
                              else
                               {var _fX_=_fT_.safeGet(i_fV_);
                                if(49<=_fX_)
                                 if(58<=_fX_)
                                  var _fY_=0;
                                 else
                                  {var
                                    _fW_=
                                     [0,
                                      caml_int_of_string
                                       (_ch_(_fT_,i_fV_,(_fT_.getLen()-i_fV_|0)-1|0)),
                                      neg_fU_],
                                    _fY_=1;}
                                else
                                 {if(45===_fX_)
                                   {var _f0_=i_fV_+1|0,_fZ_=1,neg_fU_=_fZ_,i_fV_=_f0_;
                                    continue;}
                                  var _fY_=0;}
                                if(!_fY_){var _f1_=i_fV_+1|0,i_fV_=_f1_;continue;}}
                              var match_f2_=_fW_;
                              break;}}
                          catch(_f3_)
                           {if(_f3_[1]!==_a_)throw _f3_;
                            var match_f2_=bad_conversion_cV_(_fT_,0,115);}
                          var
                           p_f4_=match_f2_[1],
                           _f5_=x_fz_.getLen(),
                           _f6_=0,
                           neg_f__=match_f2_[2],
                           _f9_=32;
                          if(p_f4_===_f5_&&0===_f6_)
                           {var _f7_=x_fz_,_f8_=1;}
                          else
                           var _f8_=0;
                          if(!_f8_)
                           if(p_f4_<=_f5_)
                            var _f7_=_ch_(x_fz_,_f6_,_f5_);
                           else
                            {var res_f$_=_cg_(p_f4_,_f9_);
                             if(neg_f__)
                              /*<<14780: printf.ml 105 7 32>>*/_ci_
                               (x_fz_,_f6_,res_f$_,0,_f5_);
                             else
                              /*<<14797: printf.ml 106 7 40>>*/_ci_
                               (x_fz_,_f6_,res_f$_,p_f4_-_f5_|0,_f5_);
                             var _f7_=res_f$_;}
                          var s_fS_=_f7_;}
                        var
                         _fi_=
                          cont_s_fh_(next_index_e7_(spec_e$_,n_e4_),s_fS_,i_e1_+1|0),
                         _fd_=1;
                        break;
                       case 67:
                       case 99:
                        var x_ga_=get_arg_e3_(spec_e$_,n_e4_);
                        if(99===_fc_)
                         var s_gb_=_cg_(1,x_ga_);
                        else
                         {if(39===x_ga_)
                           var _gc_=_bH_;
                          else
                           if(92===x_ga_)
                            var _gc_=_bI_;
                           else
                            {if(14<=x_ga_)
                              var _gd_=0;
                             else
                              switch(x_ga_)
                               {case 8:var _gc_=_bM_,_gd_=1;break;
                                case 9:var _gc_=_bL_,_gd_=1;break;
                                case 10:var _gc_=_bK_,_gd_=1;break;
                                case 13:var _gc_=_bJ_,_gd_=1;break;
                                default:var _gd_=0;}
                             if(!_gd_)
                              if(caml_is_printable(x_ga_))
                               {var s_ge_=caml_create_string(1);
                                /*<<5422: char.ml 37 27 7>>*/s_ge_.safeSet(0,x_ga_);
                                var _gc_=s_ge_;}
                              else
                               {var s_gf_=caml_create_string(4);
                                /*<<5432: char.ml 41 13 7>>*/s_gf_.safeSet(0,92);
                                /*<<5432: char.ml 41 13 7>>*/s_gf_.safeSet
                                 (1,48+(x_ga_/100|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_gf_.safeSet
                                 (2,48+((x_ga_/10|0)%10|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_gf_.safeSet
                                 (3,48+(x_ga_%10|0)|0);
                                var _gc_=s_gf_;}}
                          var s_gb_=_b3_(_bx_,_b3_(_gc_,_by_));}
                        var
                         _fi_=
                          cont_s_fh_(next_index_e7_(spec_e$_,n_e4_),s_gb_,i_e1_+1|0),
                         _fd_=1;
                        break;
                       case 66:
                       case 98:
                        var
                         _gh_=i_e1_+1|0,
                         _gg_=get_arg_e3_(spec_e$_,n_e4_)?_bP_:_bO_,
                         _fi_=cont_s_fh_(next_index_e7_(spec_e$_,n_e4_),_gg_,_gh_),
                         _fd_=1;
                        break;
                       case 40:
                       case 123:
                        var
                         xf_gi_=get_arg_e3_(spec_e$_,n_e4_),
                         i_gj_=_dI_(sub_format_for_printf_ee_,_fc_,fmt_eQ_,i_e1_+1|0);
                        if(123===_fc_)
                         {var
                           b_gk_=_cC_(xf_gi_.getLen()),
                           add_char_go_=
                            function(i_gm_,c_gl_){_cE_(b_gk_,c_gl_);return i_gm_+1|0;};
                          /*<<13715: printf.ml 268 2 19>>*/iter_on_format_args_eu_
                           (xf_gi_,
                            function(skip_gn_,i_gq_,c_gp_)
                             {if(skip_gn_)
                               /*<<13680: printf.ml 272 17 41>>*/_cF_(b_gk_,_br_);
                              else
                               /*<<13689: printf.ml 272 47 68>>*/_cE_(b_gk_,37);
                              return add_char_go_(i_gq_,c_gp_);},
                            add_char_go_);
                          var
                           _gr_=_cD_(b_gk_),
                           _fi_=cont_s_fh_(next_index_e7_(spec_e$_,n_e4_),_gr_,i_gj_),
                           _fd_=1;}
                        else
                         {var
                           _gs_=next_index_e7_(spec_e$_,n_e4_),
                           m_gv_=
                            add_int_index_cK_
                             (count_printing_arguments_of_format_gt_(xf_gi_),_gs_),
                           _fi_=
                            pr_gx_
                             (/*<<11831: printf.ml 647 30 39>>*/function(param_gw_)
                               {return doprn_gu_(m_gv_,i_gj_);},
                              _gs_,
                              xf_gi_,
                              v_eZ_),
                           _fd_=1;}
                        break;
                       case 33:
                        _cL_(flush_gy_,out_eN_);
                        var _fi_=doprn_gu_(n_e4_,i_e1_+1|0),_fd_=1;
                        break;
                       case 41:
                        var _fi_=cont_s_fh_(n_e4_,_bD_,i_e1_+1|0),_fd_=1;break;
                       case 44:
                        var _fi_=cont_s_fh_(n_e4_,_bC_,i_e1_+1|0),_fd_=1;break;
                       case 70:
                        var x_gz_=get_arg_e3_(spec_e$_,n_e4_);
                        if(0===widths_e6_)
                         var _gA_=_bB_;
                        else
                         {var
                           sfmt_gB_=
                            extract_format_dk_(fmt_eQ_,i_eS_,i_e1_,widths_e6_);
                          if(70===_fc_)
                           /*<<14498: printf.ml 164 4 8>>*/sfmt_gB_.safeSet
                            (sfmt_gB_.getLen()-1|0,103);
                          var _gA_=sfmt_gB_;}
                        var _gC_=caml_classify_float(x_gz_);
                        if(3===_gC_)
                         var s_gD_=x_gz_<0?_bv_:_bu_;
                        else
                         if(4<=_gC_)
                          var s_gD_=_bw_;
                         else
                          {var
                            _gE_=caml_format_float(_gA_,x_gz_),
                            i_gF_=0,
                            l_gG_=_gE_.getLen();
                           /*<<13007: printf.ml 448 6 37>>*/for(;;)
                            {if(l_gG_<=i_gF_)
                              var _gH_=_b3_(_gE_,_bt_);
                             else
                              {var
                                _gI_=_gE_.safeGet(i_gF_)-46|0,
                                _gJ_=
                                 _gI_<0||23<_gI_
                                  ?55===_gI_?1:0
                                  :(_gI_-1|0)<0||21<(_gI_-1|0)?1:0;
                               if(!_gJ_){var _gK_=i_gF_+1|0,i_gF_=_gK_;continue;}
                               var _gH_=_gE_;}
                             var s_gD_=_gH_;
                             break;}}
                        var
                         _fi_=
                          cont_s_fh_(next_index_e7_(spec_e$_,n_e4_),s_gD_,i_e1_+1|0),
                         _fd_=1;
                        break;
                       case 91:
                        var
                         _fi_=bad_conversion_format_dO_(fmt_eQ_,i_e1_,_fc_),
                         _fd_=1;
                        break;
                       case 97:
                        var
                         printer_gL_=get_arg_e3_(spec_e$_,n_e4_),
                         n_gM_=_cL_(_cM_,get_index_eW_(spec_e$_,n_e4_)),
                         arg_gN_=get_arg_e3_(0,n_gM_),
                         _gR_=i_e1_+1|0,
                         _gQ_=next_index_e7_(spec_e$_,n_gM_);
                        if(to_s_gO_)
                         /*<<11772: printf.ml 631 8 63>>*/outs_gP_
                          (_eb_(printer_gL_,0,arg_gN_));
                        else
                         /*<<11781: printf.ml 633 8 23>>*/_eb_
                          (printer_gL_,out_eN_,arg_gN_);
                        var _fi_=doprn_gu_(_gQ_,_gR_),_fd_=1;
                        break;
                       case 114:
                        var
                         _fi_=bad_conversion_format_dO_(fmt_eQ_,i_e1_,_fc_),
                         _fd_=1;
                        break;
                       case 116:
                        var
                         printer_gS_=get_arg_e3_(spec_e$_,n_e4_),
                         _gU_=i_e1_+1|0,
                         _gT_=next_index_e7_(spec_e$_,n_e4_);
                        if(to_s_gO_)
                         /*<<11799: printf.ml 637 8 54>>*/outs_gP_
                          (_cL_(printer_gS_,0));
                        else
                         /*<<11807: printf.ml 639 8 19>>*/_cL_(printer_gS_,out_eN_);
                        var _fi_=doprn_gu_(_gT_,_gU_),_fd_=1;
                        break;
                       default:var _fd_=0;}
                    if(!_fd_)
                     var _fi_=bad_conversion_format_dO_(fmt_eQ_,i_e1_,_fc_);
                    return _fi_;}},
               _gZ_=i_eS_+1|0,
               _gW_=0;
              return scan_positional_spec_fa_
                      (fmt_eQ_,
                       function(spec_gY_,i_gV_)
                        {return scan_flags_e9_(spec_gY_,n_gX_,_gW_,i_gV_);},
                       _gZ_);}
            /*<<11906: printf.ml 614 15 25>>*/_eb_(outc_g0_,out_eN_,_eV_);
            var _g1_=i_eS_+1|0,i_eS_=_g1_;
            continue;}}
        function cont_s_fh_(n_g4_,s_g2_,i_g3_)
         {outs_gP_(s_g2_);return doprn_gu_(n_g4_,i_g3_);}
        return doprn_gu_(n_g5_,0);}
      var
       kpr_g7_=_eb_(pr_gx_,k_g6_,index_of_int_cJ_(0)),
       _g8_=count_printing_arguments_of_format_gt_(fmt_eL_);
      if(_g8_<0||6<_g8_)
       {var
         loop_hj_=
          function(i_g9_,args_hd_)
           {if(_g8_<=i_g9_)
             {var
               a_g__=caml_make_vect(_g8_,0),
               _hb_=
                function(i_g$_,arg_ha_)
                 {return caml_array_set(a_g__,(_g8_-i_g$_|0)-1|0,arg_ha_);},
               i_hc_=0,
               param_he_=args_hd_;
              for(;;)
               {if(param_he_)
                 {var _hf_=param_he_[2],_hg_=param_he_[1];
                  if(_hf_)
                   {_hb_(i_hc_,_hg_);
                    var _hh_=i_hc_+1|0,i_hc_=_hh_,param_he_=_hf_;
                    continue;}
                  /*<<13547: printf.ml 318 11 16>>*/_hb_(i_hc_,_hg_);}
                return _eb_(kpr_g7_,fmt_eL_,a_g__);}}
            /*<<13383: printf.ml 363 31 56>>*/return function(x_hi_)
             {return loop_hj_(i_g9_+1|0,[0,x_hi_,args_hd_]);};},
         _hk_=loop_hj_(0,0);}
      else
       switch(_g8_)
        {case 1:
          var
           _hk_=
            /*<<13369: printf.ml 331 6 15>>*/function(x_hm_)
             {var a_hl_=caml_make_vect(1,0);
              /*<<13369: printf.ml 331 6 15>>*/caml_array_set(a_hl_,0,x_hm_);
              return _eb_(kpr_g7_,fmt_eL_,a_hl_);};
          break;
         case 2:
          var
           _hk_=
            function(x_ho_,y_hp_)
             {var a_hn_=caml_make_vect(2,0);
              caml_array_set(a_hn_,0,x_ho_);
              caml_array_set(a_hn_,1,y_hp_);
              return _eb_(kpr_g7_,fmt_eL_,a_hn_);};
          break;
         case 3:
          var
           _hk_=
            function(x_hr_,y_hs_,z_ht_)
             {var a_hq_=caml_make_vect(3,0);
              caml_array_set(a_hq_,0,x_hr_);
              caml_array_set(a_hq_,1,y_hs_);
              caml_array_set(a_hq_,2,z_ht_);
              return _eb_(kpr_g7_,fmt_eL_,a_hq_);};
          break;
         case 4:
          var
           _hk_=
            function(x_hv_,y_hw_,z_hx_,t_hy_)
             {var a_hu_=caml_make_vect(4,0);
              caml_array_set(a_hu_,0,x_hv_);
              caml_array_set(a_hu_,1,y_hw_);
              caml_array_set(a_hu_,2,z_hx_);
              caml_array_set(a_hu_,3,t_hy_);
              return _eb_(kpr_g7_,fmt_eL_,a_hu_);};
          break;
         case 5:
          var
           _hk_=
            function(x_hA_,y_hB_,z_hC_,t_hD_,u_hE_)
             {var a_hz_=caml_make_vect(5,0);
              caml_array_set(a_hz_,0,x_hA_);
              caml_array_set(a_hz_,1,y_hB_);
              caml_array_set(a_hz_,2,z_hC_);
              caml_array_set(a_hz_,3,t_hD_);
              caml_array_set(a_hz_,4,u_hE_);
              return _eb_(kpr_g7_,fmt_eL_,a_hz_);};
          break;
         case 6:
          var
           _hk_=
            function(x_hG_,y_hH_,z_hI_,t_hJ_,u_hK_,v_hL_)
             {var a_hF_=caml_make_vect(6,0);
              caml_array_set(a_hF_,0,x_hG_);
              caml_array_set(a_hF_,1,y_hH_);
              caml_array_set(a_hF_,2,z_hI_);
              caml_array_set(a_hF_,3,t_hJ_);
              caml_array_set(a_hF_,4,u_hK_);
              caml_array_set(a_hF_,5,v_hL_);
              return _eb_(kpr_g7_,fmt_eL_,a_hF_);};
          break;
         default:var _hk_=_eb_(kpr_g7_,fmt_eL_,[0]);}
      return _hk_;}
    /*<<11565: printf.ml 678 2 19>>*/function _hU_(fmt_hM_)
     {return _cC_(2*fmt_hM_.getLen()|0);}
    function _hR_(k_hP_,b_hN_)
     {var s_hO_=_cD_(b_hN_);
      /*<<11210: buffer.ml 56 14 29>>*/b_hN_[2]=0;
      return _cL_(k_hP_,s_hO_);}
    /*<<11524: printf.ml 691 2 78>>*/function _hZ_(k_hQ_)
     {var _hT_=_cL_(_hR_,k_hQ_);
      return _hW_(_hV_,1,_hU_,_cE_,_cF_,function(_hS_){return 0;},_hT_);}
    /*<<11512: printf.ml 694 18 43>>*/function _h0_(fmt_hY_)
     {return _eb_
              (_hZ_,
               /*<<11509: printf.ml 694 37 38>>*/function(s_hX_)
                {return s_hX_;},
               fmt_hY_);}
    var _h1_=[0,0];
    /*<<16823: random.ml 75 4 12>>*/function _h5_(s_h2_)
     {/*<<16823: random.ml 75 4 12>>*/s_h2_[2]=(s_h2_[2]+1|0)%55|0;
      var
       curval_h3_=caml_array_get(s_h2_[1],s_h2_[2]),
       newval30_h4_=
        (caml_array_get(s_h2_[1],(s_h2_[2]+24|0)%55|0)+
         (curval_h3_^curval_h3_>>>25&31)|
         0)&
        1073741823;
      /*<<16823: random.ml 75 4 12>>*/caml_array_set
       (s_h2_[1],s_h2_[2],newval30_h4_);
      return newval30_h4_;}
    32===_cj_;
    var _h6_=[0,_bh_.slice(),0];
    /*<<16525: random.ml 165 16 39>>*/function _ia_(bound_h7_)
     {if(1073741823<bound_h7_||!(0<bound_h7_))
       var _h8_=0;
      else
       for(;;)
        {var r_h9_=_h5_(_h6_),v_h__=caml_mod(r_h9_,bound_h7_);
         if(((1073741823-bound_h7_|0)+1|0)<(r_h9_-v_h__|0))continue;
         var _h$_=v_h__,_h8_=1;
         break;}
      if(!_h8_)var _h$_=_bS_(_bi_);
      return _h$_;}
    var seq_ib_=[];
    /*<<17834: src/core/lwt_sequence.ml 63 2 5>>*/caml_update_dummy
     (seq_ib_,[0,seq_ib_,seq_ib_]);
    var null_ic_=null,undefined_id_=undefined;
    function _ih_(x_ie_,f_if_,g_ig_)
     {return x_ie_===undefined_id_?_cL_(f_if_,0):_cL_(g_ig_,x_ie_);}
    var regExp_ii_=RegExp,array_constructor_ij_=Array;
    function array_get_in_(_ik_,_il_){return _ik_[_il_];}
    /*<<24755: js.ml 376 7 77>>*/function _io_(e_im_)
     {return e_im_ instanceof array_constructor_ij_
              ?0
              :[0,new MlWrappedString(e_im_.toString())];}
    /*<<15420: printexc.ml 167 2 29>>*/_h1_[1]=[0,_io_,_h1_[1]];
    function _iq_(_ip_){return _ip_;}
    _iq_(this.HTMLElement)===undefined_id_;
    /*<<34280: regexp.ml 25 15 73>>*/function regexp_is_(s_ir_)
     {return new regExp_ii_(caml_js_from_byte_string(s_ir_),_bf_.toString());}
    new regExp_ii_(_bd_.toString(),_be_.toString());
    var _iw_=regexp_is_(_bc_);
    function split_iv_(c_it_,s_iu_)
     {return s_iu_.split(_cg_(1,c_it_).toString());}
    var Local_exn_ix_=[0,_a__];
    /*<<35836: url.ml 27 19 34>>*/function interrupt_iz_(param_iy_)
     {throw [0,Local_exn_ix_];}
    regexp_is_
     (caml_js_to_byte_string
       (caml_js_from_byte_string(_a9_).replace(_iw_,_bg_.toString())));
    var plus_re_js_string_iA_=new regExp_ii_(_a7_.toString(),_a8_.toString());
    /*<<35761: url.ml 44 2 60>>*/function urldecode_js_string_string_iN_
     (s_iB_)
     {/*<<35784: url.ml 39 2 3>>*/plus_re_js_string_iA_.lastIndex=0;
      return caml_js_to_byte_string
              (unescape(s_iB_.replace(plus_re_js_string_iA_,_a$_.toString())));}
    /*<<34417: url.ml 97 2 23>>*/function path_of_path_string_iI_(s_iC_)
     {/*<<34417: url.ml 97 2 23>>*/try
       {var length_iD_=s_iC_.getLen();
        if(0===length_iD_)
         var _iE_=_bb_;
        else
         {var i_iF_=0,_iH_=47,_iG_=s_iC_.getLen();
          for(;;)
           {if(_iG_<=i_iF_)throw [0,_c_];
            if(s_iC_.safeGet(i_iF_)!==_iH_)
             {var _iL_=i_iF_+1|0,i_iF_=_iL_;continue;}
            if(0===i_iF_)
             var
              _iJ_=
               [0,_ba_,path_of_path_string_iI_(_ch_(s_iC_,1,length_iD_-1|0))];
            else
             {var
               _iK_=
                path_of_path_string_iI_
                 (_ch_(s_iC_,i_iF_+1|0,(length_iD_-i_iF_|0)-1|0)),
               _iJ_=[0,_ch_(s_iC_,0,i_iF_),_iK_];}
            var _iE_=_iJ_;
            break;}}}
      catch(_iM_){if(_iM_[1]===_c_)return [0,s_iC_,0];throw _iM_;}
      return _iE_;}
    new regExp_ii_(caml_js_from_byte_string(_a6_));
    new regExp_ii_(caml_js_from_byte_string(_a5_));
    var l_iO_=location;
    urldecode_js_string_string_iN_(l_iO_.hostname);
    try {}catch(_iP_){if(_iP_[1]!==_a_)throw _iP_;}
    path_of_path_string_iI_(urldecode_js_string_string_iN_(l_iO_.pathname));
    var arr_iQ_=split_iv_(38,l_iO_.search),len_ja_=arr_iQ_.length;
    function aux_i8_(acc_i7_,idx_iR_)
     {var idx_iS_=idx_iR_;
      for(;;)
       {if(0<=idx_iS_)
         {/*<<35441: url.ml 132 9 45>>*/try
           {var
             _i5_=idx_iS_-1|0,
             _i6_=
              /*<<35415: url.ml 135 30 33>>*/function(s_i0_)
               {/*<<35396: url.ml 137 37 48>>*/function _i2_(param_iT_)
                 {var y_iY_=param_iT_[2],x_iX_=param_iT_[1];
                  /*<<35385: url.ml 139 36 65>>*/function get_iW_(t_iU_)
                   {var _iV_=t_iU_===undefined_id_?interrupt_iz_(0):t_iU_;
                    return urldecode_js_string_string_iN_(_iV_);}
                  var _iZ_=get_iW_(y_iY_);
                  return [0,get_iW_(x_iX_),_iZ_];}
                var arr_bis_i1_=split_iv_(61,s_i0_);
                if(2===arr_bis_i1_.length)
                 {var
                   _i3_=array_get_in_(arr_bis_i1_,1),
                   _i4_=_iq_([0,array_get_in_(arr_bis_i1_,0),_i3_]);}
                else
                 var _i4_=undefined_id_;
                return _ih_(_i4_,interrupt_iz_,_i2_);},
             _i9_=
              aux_i8_
               ([0,
                 _ih_(array_get_in_(arr_iQ_,idx_iS_),interrupt_iz_,_i6_),
                 acc_i7_],
                _i5_);}
          catch(_i__)
           {if(_i__[1]===Local_exn_ix_)
             {var _i$_=idx_iS_-1|0,idx_iS_=_i$_;continue;}
            throw _i__;}
          return _i9_;}
        return acc_i7_;}}
    /*<<35548: url.ml 121 2 16>>*/aux_i8_(0,len_ja_-1|0);
    urldecode_js_string_string_iN_(l_iO_.href);
    function _jf_(f_jc_,param_jb_)
     {var x_jd_=param_jb_[1],_je_=_cL_(f_jc_,param_jb_[2]);
      return [0,_cL_(f_jc_,x_jd_),_je_];}
    /*<<40727: src/option.ml 23 16 15>>*/function _jh_(param_jg_)
     {return param_jg_?param_jg_[1]:_i_(_a4_);}
    function _jx_(arr_ji_,f_jl_)
     {var l_jj_=arr_ji_.length-1;
      if(0===l_jj_)
       var _jk_=[0];
      else
       {var
         r_jm_=caml_make_vect(l_jj_,_cL_(f_jl_,arr_ji_[0+1])),
         _jn_=1,
         _jo_=l_jj_-1|0;
        if(!(_jo_<_jn_))
         {var i_jp_=_jn_;
          for(;;)
           {r_jm_[i_jp_+1]=_cL_(f_jl_,arr_ji_[i_jp_+1]);
            var _jq_=i_jp_+1|0;
            if(_jo_!==i_jp_){var i_jp_=_jq_;continue;}
            break;}}
        var _jk_=r_jm_;}
      return _jk_;}
    function _jy_(arr_js_,f_jv_)
     {var _jr_=0,_jt_=arr_js_.length-1-1|0;
      if(!(_jt_<_jr_))
       {var i_ju_=_jr_;
        for(;;)
         {_cL_(f_jv_,arr_js_[i_ju_+1]);
          var _jw_=i_ju_+1|0;
          if(_jt_!==i_ju_){var i_ju_=_jw_;continue;}
          break;}}
      return 0;}
    ({}.iter=caml_js_eval_string(_a3_));
    function _jC_(_opt__jz_,ts_jB_)
     {var sep_jA_=_opt__jz_?_opt__jz_[1]:_a2_;
      return new
              MlWrappedString
              (caml_js_from_array(ts_jB_).join(sep_jA_.toString()));}
    var
     _jD_=caml_js_eval_string(_a0_),
     _jM_={"iter":caml_js_eval_string(_aZ_),"fold":_jD_};
    /*<<43483: src/inttbl.ml 19 16 34>>*/function _jX_(param_jE_){return {};}
    function _jY_(t_jF_,key_jG_,data_jH_){return t_jF_[key_jG_]=data_jH_;}
    function _jZ_(t_jI_,k_jJ_){return delete t_jI_[k_jJ_];}
    function _j0_(t_jK_,k_jL_)
     {return t_jK_.hasOwnProperty(k_jL_)|0?[0,t_jK_[k_jL_]]:0;}
    function _jV_(t_jR_,f_jP_)
     {var js_iter_jQ_=_jM_[_a1_.toString()];
      return js_iter_jQ_
              (t_jR_,
               caml_js_wrap_callback
                (function(key_jO_,data_jN_)
                  {return _eb_(f_jP_,key_jO_,data_jN_);}));}
    /*<<43065: src/inttbl.ml 83 2 6>>*/function _j1_(t_jW_)
     {var len_jS_=[0,0];
      /*<<43065: src/inttbl.ml 83 2 6>>*/_jV_
       (t_jW_,function(param_jT_,_jU_){len_jS_[1]+=1;return 0;});
      return len_jS_[1];}
    /*<<43919: src/core.ml 17 24 73>>*/function string_of_float_j3_(x_j2_)
     {return new MlWrappedString(x_j2_.toString());}
    caml_js_eval_string(_aY_);
    function _j6_(x_j4_,f_j5_){return _cL_(f_j5_,x_j4_);}
    /*<<46731: src/frp.ml 18 24 26>>*/function _mf_(param_j7_){return 0;}
    /*<<46727: src/frp.ml 20 17 21>>*/function _j9_(t_j8_)
     {return _cL_(t_j8_,0);}
    function _mg_(t1_j__,t2_j$_,param_ka_){_j9_(t1_j__);return _j9_(t2_j$_);}
    function _mh_(ts_kb_,param_kc_){return _jy_(ts_kb_,_j9_);}
    /*<<46702: src/frp.ml 26 15 16>>*/function _lD_(x_kd_){return x_kd_;}
    function notify_ki_(listeners_kh_,x_ke_)
     {return _jV_
              (listeners_kh_,
               function(param_kg_,data_kf_){return _cL_(data_kf_,x_ke_);});}
    function notify_all_kw_(ls_kl_,x_kj_)
     {return _jy_
              (ls_kl_,
               /*<<46659: src/frp.ml 33 51 61>>*/function(l_kk_)
                {return notify_ki_(l_kk_,x_kj_);});}
    function _lh_(tbl_kp_,t_km_,f_ko_)
     {var key_kn_=t_km_[6];
      t_km_[6]=t_km_[6]+1|0;
      _jY_(tbl_kp_,key_kn_,f_ko_);
      return key_kn_;}
    function create_mi_(start_kq_,param_kE_)
     {var
       start_kr_=start_kq_?start_kq_[1]:function(param_ks_,_kt_){return 0;},
       on_listeners_ku_=_jX_(0),
       passive_listeners_kv_=_jX_(0);
      /*<<46582: src/frp.ml 52 8 58>>*/function trigger_ky_(x_kx_)
       {return notify_all_kw_
                ([0,on_listeners_ku_,passive_listeners_kv_],x_kx_);}
      var _kC_=0,_kB_=_jX_(0);
      /*<<46579: src/frp.ml 57 39 41>>*/function _kD_(param_kz_){return 0;}
      return [0,
              [0,
               /*<<46575: src/frp.ml 56 27 40>>*/function(param_kA_)
                {return _cL_(start_kr_,trigger_ky_);},
               _kD_,
               on_listeners_ku_,
               _kB_,
               passive_listeners_kv_,
               _kC_]];}
    function turn_on_kS_(key_kI_,t_kF_)
     {{if(0===t_kF_[0])
        {var
          p_kG_=t_kF_[1],
          go_kK_=
           function(tbl_kJ_,f_kH_)
            {_jY_(p_kG_[3],key_kI_,f_kH_);
             _jZ_(tbl_kJ_,key_kI_);
             return 1===_j1_(p_kG_[3])?(p_kG_[2]=_cL_(p_kG_[1],0),0):0;},
          _kL_=_j0_(p_kG_[4],key_kI_);
         if(_kL_)
          var _kM_=go_kK_(p_kG_[4],_kL_[1]);
         else
          {var
            _kN_=_j0_(p_kG_[5],key_kI_),
            _kM_=_kN_?go_kK_(p_kG_[5],_kN_[1]):_i_(_aU_);}
         return _kM_;}
       var
        d_kO_=t_kF_[1],
        go_kU_=
         function(tbl_kQ_,f_kP_)
          {_jY_(d_kO_[2],key_kI_,f_kP_);
           _jZ_(tbl_kQ_,key_kI_);
           if(1===_j1_(d_kO_[2]))
            {var
              _kT_=
               /*<<44732: src/frp.ml 181 40 64>>*/function(param_kR_)
                {return turn_on_kS_(param_kR_[1],param_kR_[2][1]);};
             return _jy_(d_kO_[5],_kT_);}
           return 0;},
        _kV_=_j0_(d_kO_[3],key_kI_);
       if(_kV_)
        var _kW_=go_kU_(d_kO_[3],_kV_[1]);
       else
        {var
          _kX_=_j0_(d_kO_[4],key_kI_),
          _kW_=_kX_?go_kU_(d_kO_[4],_kX_[1]):_i_(_aX_);}
       return _kW_;}}
    function turn_off_k__(key_k1_,t_kY_)
     {{if(0===t_kY_[0])
        {var
          p_kZ_=t_kY_[1],
          go_k3_=
           function(tbl_k2_,f_k0_)
            {_jY_(p_kZ_[4],key_k1_,f_k0_);return _jZ_(tbl_k2_,key_k1_);},
          _k4_=_j0_(p_kZ_[3],key_k1_);
         if(_k4_)
          {go_k3_(p_kZ_[3],_k4_[1]);
           var _k5_=0===_j1_(p_kZ_[3])?_cL_(p_kZ_[2],0):0;}
         else
          {var
            _k6_=_j0_(p_kZ_[5],key_k1_),
            _k5_=_k6_?go_k3_(p_kZ_[5],_k6_[1]):_i_(_aV_);}
         return _k5_;}
       var d_k7_=t_kY_[1],_k8_=_j0_(d_k7_[2],key_k1_);
       if(_k8_)
        {_jY_(d_k7_[3],key_k1_,_k8_[1]);
         _jZ_(d_k7_[2],key_k1_);
         if(0===_j1_(d_k7_[2]))
          {var
            _k$_=
             /*<<44869: src/frp.ml 203 42 67>>*/function(param_k9_)
              {return turn_off_k__(param_k9_[1],param_k9_[2][1]);},
            _la_=_jy_(d_k7_[5],_k$_);}
         else
          var _la_=0;}
       else
        var _la_=_i_(_aW_);
       return _la_;}}
    function add_listener__lk_(tbl_le_,t_lb_,f_ld_)
     {var key_lc_=t_lb_[1];
      t_lb_[1]=t_lb_[1]+1|0;
      _jY_(tbl_le_,key_lc_,f_ld_);
      return key_lc_;}
    function add_off_listener_lr_(t_lf_,f_li_)
     {{if(0===t_lf_[0]){var p_lg_=t_lf_[1];return _lh_(p_lg_[4],p_lg_,f_li_);}
       var d_lj_=t_lf_[1];
       return add_listener__lk_(d_lj_[3],d_lj_,f_li_);}}
    function create_with_lx_(parent_ls_,update_lq_)
     {var on_listeners_ll_=_jX_(0),passive_listeners_lm_=_jX_(0);
      /*<<45926: src/frp.ml 244 6 32>>*/function trigger_lp_(x_ln_)
       {/*<<45926: src/frp.ml 244 6 32>>*/notify_ki_(on_listeners_ll_,x_ln_);
        return notify_ki_(passive_listeners_lm_,x_ln_);}
      var
       _lt_=
        [0,
         [0,
          add_off_listener_lr_
           (parent_ls_,
            /*<<45921: src/frp.ml 247 48 64>>*/function(x_lo_)
             {return _eb_(update_lq_,trigger_lp_,x_lo_);}),
          [0,parent_ls_]]];
      return [1,[0,0,on_listeners_ll_,_jX_(0),passive_listeners_lm_,_lt_]];}
    function map_lQ_(t_ly_,f_lv_)
     {return create_with_lx_
              (t_ly_,
               function(trigger_lw_,x_lu_)
                {return _cL_(trigger_lw_,_cL_(f_lv_,x_lu_));});}
    function iter_mj_(t_lA_,f_lz_)
     {var key_lB_=add_off_listener_lr_(t_lA_,f_lz_);
      turn_on_kS_(key_lB_,t_lA_);
      return _lD_
              (/*<<45878: src/frp.ml 264 33 47>>*/function(param_lC_)
                {return turn_off_k__(key_lB_,t_lA_);});}
    /*<<44672: src/frp.ml 449 15 25>>*/function peek_mk_(t_lE_)
     {return t_lE_[2][1];}
    /*<<44659: src/frp.ml 451 20 75>>*/function return_ml_(init_lF_)
     {var _lG_=_jX_(0),_lH_=_jX_(0);
      return [0,[1,[0,0,_jX_(0),_lH_,_lG_,[0]]],[0,init_lF_],0];}
    function create_lU_(value_lI_,s_lL_)
     {/*<<44633: src/frp.ml 454 52 62>>*/function _lK_(x_lJ_)
       {/*<<44633: src/frp.ml 454 52 62>>*/value_lI_[1]=x_lJ_;return 0;}
      if(0===s_lL_[0])
       {var p_lM_=s_lL_[1],k_lN_=_lh_(p_lM_[5],p_lM_,_lK_);}
      else
       {var d_lO_=s_lL_[1],k_lN_=add_listener__lk_(d_lO_[4],d_lO_,_lK_);}
      return [0,s_lL_,value_lI_,[0,k_lN_]];}
    function map_mm_(param_lP_,f_lR_)
     {var value_lS_=param_lP_[2],s__lT_=map_lQ_(param_lP_[1],f_lR_);
      return create_lU_([0,_cL_(f_lR_,value_lS_[1])],s__lT_);}
    function zip_with_mn_(t1_l0_,t2_lX_,f_lZ_)
     {var on_listeners_lV_=_jX_(0),passive_listeners_lW_=_jX_(0);
      /*<<44482: src/frp.ml 470 8 27>>*/function _l1_(x_lY_)
       {return notify_all_kw_
                ([0,on_listeners_lV_,passive_listeners_lW_],
                 _eb_(f_lZ_,x_lY_,t2_lX_[2][1]));}
      var key1_l3_=add_off_listener_lr_(t1_l0_[1],_l1_);
      /*<<44464: src/frp.ml 473 8 27>>*/function _l4_(y_l2_)
       {return notify_all_kw_
                ([0,on_listeners_lV_,passive_listeners_lW_],
                 _eb_(f_lZ_,t1_l0_[2][1],y_l2_));}
      var
       key2_l5_=add_off_listener_lr_(t2_lX_[1],_l4_),
       _l6_=[0,[0,key1_l3_,[0,t1_l0_[1]]],[0,key2_l5_,[0,t2_lX_[1]]]],
       s_l7_=[1,[0,0,on_listeners_lV_,_jX_(0),passive_listeners_lW_,_l6_]];
      return create_lU_([0,_eb_(f_lZ_,t1_l0_[2][1],t2_lX_[2][1])],s_l7_);}
    /*<<44261: src/frp.ml 521 14 24>>*/function _mo_(param_l8_)
     {return param_l8_[1];}
    function _mp_(s_me_,init_l9_,f_ma_)
     {var last_l__=[0,init_l9_],value_md_=[0,init_l9_];
      return create_lU_
              (value_md_,
               create_with_lx_
                (s_me_,
                 function(trigger_mc_,x_l$_)
                  {var y_mb_=_eb_(f_ma_,last_l__[1],x_l$_);
                   last_l__[1]=y_mb_;
                   return _cL_(trigger_mc_,y_mb_);}));}
    /*<<48663: src/jq.ml 5 29 84>>*/function unsafe_jq_mR_(s_mq_)
     {return jQuery(s_mq_.toString());}
    /*<<48617: src/jq.ml 14 13 58>>*/function wrap_mA_(elt_mr_)
     {return jQuery(elt_mr_);}
    function stop_on_removal_mC_(t_mv_,sub_ms_)
     {var
       _mu_=
        caml_js_wrap_callback
         (/*<<48387: src/jq.ml 56 27 54>>*/function(param_mt_)
           {return _j9_(sub_ms_);});
      t_mv_.on(_aM_.toString(),_mu_);
      return sub_ms_;}
    function _mS_(t_mz_,name_mx_,value_mw_)
     {var _my_=peek_mk_(value_mw_).toString();
      t_mz_.setAttribute(name_mx_.toString(),_my_);
      var
       name_mB_=name_mx_.toString(),
       _mE_=_cL_(stop_on_removal_mC_,wrap_mA_(t_mz_));
      /*<<48211: src/jq.ml 83 6 7>>*/function _mF_(value_mD_)
       {return t_mz_.setAttribute(name_mB_,value_mD_.toString());}
      return _j6_(iter_mj_(_mo_(value_mw_),_mF_),_mE_);}
    function _mT_(t_mH_,s_mG_){return t_mH_.innerHTML=s_mG_.toString();}
    function _mU_(t_mI_,c_mJ_){t_mI_.appendChild(c_mJ_);return 0;}
    function _mV_(tag_mM_,attrs_mQ_)
     {/*<<48005: src/jq.ml 101 16 46>>*/function str_mL_(s_mK_)
       {return s_mK_.toString();}
      var
       _mN_=str_mL_(tag_mM_),
       elt_mO_=document.createElementNS(str_mL_(_aN_),_mN_);
      _jy_
       (attrs_mQ_,
        /*<<47979: src/jq.ml 107 29 49>>*/function(param_mP_)
         {return elt_mO_.setAttribute
                  (param_mP_[1].toString(),param_mP_[2].toString());});
      return elt_mO_;}
    var body_mW_=unsafe_jq_mR_(_aJ_);
    function setup_event_handlers_m4_(t_m1_,hs_mY_)
     {var
       hs__mZ_=
        _jx_
         (hs_mY_,
          /*<<47881: src/jq.ml 156 33 42>>*/function(param_mX_)
           {return [0,param_mX_[1],caml_js_wrap_callback(param_mX_[2])];});
      _jy_
       (hs__mZ_,
        /*<<47871: src/jq.ml 159 25 43>>*/function(param_m0_)
         {return t_m1_.on(param_m0_[1].toString(),param_m0_[2]);});
      /*<<47858: src/jq.ml 161 12 45>>*/return function(param_m3_)
       {return _jy_
                (hs__mZ_,
                 /*<<47848: src/jq.ml 161 35 44>>*/function(param_m2_)
                  {return t_m1_.off(param_m2_[1].toString(),param_m2_[2]);});};}
    var
     _m$_=0,
     key_stream_nb_=
      create_mi_
       ([0,
         /*<<47821: src/jq.ml 166 4 6>>*/function(trigger_m8_)
          {/*<<47812: src/jq.ml 166 34 59>>*/function which_m7_(e_m5_)
            {return e_m5_[_aQ_.toString()];}
           var
            _m__=
             [0,
              _aP_,
              /*<<47788: src/jq.ml 169 27 71>>*/function(e_m6_)
               {/*<<47788: src/jq.ml 169 27 71>>*/e_m6_.preventDefault();
                return _cL_(trigger_m8_,[0,19067,which_m7_(e_m6_)]);}];
           return setup_event_handlers_m4_
                   (body_mW_,
                    [0,
                     [0,
                      _aO_,
                      /*<<47758: src/jq.ml 168 27 73>>*/function(e_m9_)
                       {/*<<47758: src/jq.ml 168 27 73>>*/e_m9_.preventDefault();
                        return _cL_(trigger_m8_,[0,759637122,which_m7_(e_m9_)]);}],
                     _m__]);}],
        _m$_),
     pressed_na_=_jX_(0);
    _mp_
     (key_stream_nb_,
      [0],
      function(param_ng_,k_nc_)
       {if(759637122<=k_nc_[1])
         _jY_(pressed_na_,k_nc_[2],0);
        else
         _jZ_(pressed_na_,k_nc_[2]);
        var arr_nd_=new array_constructor_ij_();
        /*<<43165: src/inttbl.ml 68 2 17>>*/_jV_
         (pressed_na_,
          function(key_ne_,data_nf_){return arr_nd_.push(key_ne_);});
        return caml_js_to_array(arr_nd_);});
    var
     _nj_=0,
     mouse_pos_nk_=
      create_mi_
       ([0,
         /*<<47692: src/jq.ml 184 4 54>>*/function(trigger_ni_)
          {return setup_event_handlers_m4_
                   (body_mW_,
                    [0,
                     [0,
                      _aR_,
                      /*<<47673: src/jq.ml 185 6 78>>*/function(e_nh_)
                       {return _cL_
                                (trigger_ni_,
                                 [0,e_nh_[_aS_.toString()],e_nh_[_aT_.toString()]]);}]]);}],
        _nj_),
     last_nl_=[0,0];
    create_with_lx_
     (mouse_pos_nk_,
      function(trigger_np_,x_no_)
       {var _nm_=last_nl_[1];
        if(_nm_)
         {var x_nn_=_nm_[1];
          _cL_(trigger_np_,[0,x_no_[1]-x_nn_[1]|0,x_no_[2]-x_nn_[2]|0]);}
        last_nl_[1]=[0,x_no_];
        return 0;});
    /*<<51746: src/draw.ml 8 13 65>>*/function _nt_(param_nq_)
     {var x_nr_=param_nq_[1],_ns_=_b3_(_r_,string_of_float_j3_(param_nq_[2]));
      return _b3_(string_of_float_j3_(x_nr_),_ns_);}
    /*<<51729: src/draw.ml 10 24 78>>*/function _ny_(pts_nu_)
     {return _jC_(_s_,_jx_(pts_nu_,_nt_));}
    /*<<51660: src/draw.ml 21 13 50>>*/function _nx_(param_nv_)
     {return _nw_
              (_h0_,_t_,param_nv_[1],param_nv_[2],param_nv_[3],param_nv_[4]);}
    var _ou_=[0,_e_[1],_e_[2],_e_[3],0],c_nz_=2*(4*Math.atan(1))/360;
    /*<<51651: src/draw.ml 38 58 64>>*/function to_radians_n$_(x_nA_)
     {return c_nz_*x_nA_;}
    /*<<51323: src/draw.ml 85 15 56>>*/function _nF_(param_nB_)
     {switch(param_nB_[0])
       {case 1:return _dI_(_h0_,_y_,param_nB_[1],param_nB_[2]);
        case 2:return _dI_(_h0_,_x_,param_nB_[1],param_nB_[2]);
        case 3:
         var match_nC_=param_nB_[2];
         return _nD_(_h0_,_w_,param_nB_[1],match_nC_[1],match_nC_[2]);
        case 4:return _eb_(_h0_,_v_,param_nB_[1]);
        case 5:return _eb_(_h0_,_u_,param_nB_[1]);
        default:
         return _nE_
                 (_h0_,
                  _z_,
                  param_nB_[1],
                  param_nB_[2],
                  param_nB_[3],
                  param_nB_[4],
                  param_nB_[5],
                  param_nB_[6]);}}
    /*<<51306: src/draw.ml 95 4 57>>*/function _ow_(ts_nG_)
     {return _jC_(_A_,_jx_(ts_nG_,_nF_));}
    function _ov_(_opt__nH_,_nJ_,color_nL_,width_nM_)
     {var
       cap_nI_=_opt__nH_?_opt__nH_[1]:737755699,
       join_nK_=_nJ_?_nJ_[1]:463106021;
      return [1,[0,cap_nI_,join_nK_,width_nM_,color_nL_]];}
    /*<<51089: src/draw.ml 149 4 60>>*/function _op_(param_nN_)
     {switch(param_nN_[0])
       {case 1:
         var
          match_nO_=param_nN_[1],
          join_nP_=match_nO_[2],
          cap_nQ_=match_nO_[1],
          color_nT_=match_nO_[4],
          width_nS_=match_nO_[3],
          _nR_=9660462===join_nP_?_E_:463106021<=join_nP_?_G_:_F_,
          _nV_=_b3_(_O_,_nR_),
          _nU_=226915517===cap_nQ_?_B_:737755699<=cap_nQ_?_D_:_C_,
          _nW_=_b3_(_N_,_nU_),
          _nX_=_b3_(_M_,string_of_int_b4_(width_nS_));
         return _jC_(_K_,[0,_b3_(_L_,_nx_(color_nT_)),_nX_,_nW_,_nV_]);
        case 2:
         return _b3_(_I_,_jC_(_J_,_jx_(param_nN_[1],string_of_float_j3_)));
        case 3:return _dI_(_h0_,_H_,param_nN_[1],param_nN_[2]);
        default:return _b3_(_P_,_nx_(param_nN_[1]));}}
    /*<<51045: src/draw.ml 180 27 60>>*/function _n7_(param_nY_)
     {return -64519044<=param_nY_?0:1;}
    /*<<50905: src/draw.ml 184 15 57>>*/function _oy_(param_nZ_)
     {switch(param_nZ_[0])
       {case 1:
         var match_n0_=param_nZ_[1];
         return _dI_(_h0_,_S_,match_n0_[1],match_n0_[2]);
        case 2:
         var
          r_n1_=param_nZ_[4],
          match_n2_=param_nZ_[1],
          l_n6_=param_nZ_[2],
          y_n5_=match_n2_[2],
          x_n4_=match_n2_[1],
          _n3_=5594516<=param_nZ_[3]?0:1;
         return _nE_(_h0_,_R_,r_n1_,r_n1_,_n7_(l_n6_),_n3_,x_n4_,y_n5_);
        case 3:
         var
          r_n8_=param_nZ_[4],
          a1_n9_=param_nZ_[1],
          a2_n__=param_nZ_[2],
          flag_oa_=_n7_(param_nZ_[3]),
          _ob_=Math.sin(to_radians_n$_(a1_n9_))*r_n8_,
          _oc_=-Math.cos(to_radians_n$_(a1_n9_))*r_n8_,
          y_of_=_d_[2],
          x_oe_=_d_[1],
          angle_od_=to_radians_n$_(a2_n__-a1_n9_),
          _og_=y_of_-_ob_,
          _oh_=x_oe_-_oc_;
         return _hW_
                 (_h0_,
                  _Q_,
                  r_n8_,
                  r_n8_,
                  flag_oa_,
                  _oh_*Math.cos(angle_od_)-_og_*Math.sin(angle_od_)+_oc_,
                  _oh_*Math.sin(angle_od_)+_og_*Math.cos(angle_od_)+_ob_);
        default:
         var match_oi_=param_nZ_[1];
         return _dI_(_h0_,_T_,match_oi_[1],match_oi_[2]);}}
    function path_ox_(name_ol_,_opt__oj_,mask_on_,anchor_oo_,segs_om_)
     {var props_ok_=_opt__oj_?_opt__oj_[1]:[0];
      return [3,[0,name_ol_],props_ok_,anchor_oo_,mask_on_,segs_om_];}
    /*<<50546: src/draw.ml 303 27 89>>*/function render_properties_oz_(ps_oq_)
     {return _jC_(_V_,_jx_(ps_oq_,_op_));}
    function sink_attrs_oA_(elt_os_,ps_ot_)
     {return _j6_
              (_jx_
                (ps_ot_,
                 /*<<50510: src/draw.ml 306 20 70>>*/function(param_or_)
                  {return _mS_(elt_os_,param_or_[1],param_or_[2]);}),
               _mh_);}
    var render_oB_=[];
    /*<<50179: src/draw.ml 333 39 66>>*/function _oD_(param_oC_)
     {return string_of_float_j3_(param_oC_[1]);}
    function x_beh_p2_(_oE_){return map_mm_(_oE_,_oD_);}
    /*<<50166: src/draw.ml 334 39 66>>*/function _oG_(param_oF_)
     {return string_of_float_j3_(param_oF_[2]);}
    function y_beh_p0_(_oH_){return map_mm_(_oH_,_oG_);}
    /*<<50153: src/draw.ml 335 23 70>>*/function zip_props_pe_(ps_b_oK_)
     {var
       on_listeners_oI_=_jX_(0),
       passive_listeners_oJ_=_jX_(0),
       parents_oP_=
        _jx_
         (ps_b_oK_,
          /*<<44373: src/frp.ml 493 10 33>>*/function(t_oM_)
           {/*<<44350: src/frp.ml 494 12 40>>*/function _oN_(x_oL_)
             {return notify_all_kw_
                      ([0,on_listeners_oI_,passive_listeners_oJ_],
                       render_properties_oz_(_jx_(ps_b_oK_,peek_mk_)));}
            var key_oO_=add_off_listener_lr_(t_oM_[1],_oN_);
            return [0,key_oO_,[0,t_oM_[1]]];}),
       s_oQ_=
        [1,[0,0,on_listeners_oI_,_jX_(0),passive_listeners_oJ_,parents_oP_]];
      return create_lU_
              ([0,render_properties_oz_(_jx_(ps_b_oK_,peek_mk_))],s_oQ_);}
    function path_mask_pD_(elt_oR_,segs_o1_,mask_o3_,props_o__)
     {/*<<50055: src/draw.ml 338 32 77>>*/function get_length_oT_(param_oS_)
       {return elt_oR_.getTotalLength();}
      var _oX_=get_length_oT_(0);
      function _oW_(param_oV_,x_oU_){return x_oU_;}
      function _o0_(_oY_){return _mp_(_oY_,_oX_,_oW_);}
      /*<<50039: src/draw.ml 340 62 75>>*/function _o2_(param_oZ_)
       {return get_length_oT_(0);}
      var path_length_o8_=_j6_(map_lQ_(_mo_(segs_o1_),_o2_),_o0_);
      if(mask_o3_)
       {var
         mask_o7_=mask_o3_[1],
         _o9_=
          [0,
           zip_with_mn_
            (path_length_o8_,
             mask_o7_,
             function(l_o6_,param_o4_)
              {var a_o5_=param_o4_[1];
               return [2,[254,0,l_o6_*a_o5_,l_o6_*(param_o4_[2]-a_o5_),l_o6_]];})],
         l1_o$_=props_o__.length-1;
        if(0===l1_o$_)
         {var
           l_pa_=_o9_.length-1,
           _pb_=0===l_pa_?[0]:caml_array_sub(_o9_,0,l_pa_),
           _pc_=_pb_;}
        else
         var
          _pc_=
           0===_o9_.length-1
            ?caml_array_sub(props_o__,0,l1_o$_)
            :caml_array_append(props_o__,_o9_);
        var props__pd_=_pc_;}
      else
       var props__pd_=props_o__;
      return _mS_(elt_oR_,_W_,zip_props_pe_(props__pd_));}
    function mk_name_sub_pv_(name_opt_pf_,elt_pg_)
     {if(name_opt_pf_)
       {var
         x_ph_=name_opt_pf_[1],
         _pi_=wrap_mA_(elt_pg_),
         _pj_=_cL_(x_ph_[1],_pi_);}
      else
       var _pj_=_mf_;
      return _pj_;}
    /*<<49973: src/draw.ml 359 27 49>>*/function pixel_str_of_int_qp_(n_pk_)
     {return _b3_(string_of_int_b4_(n_pk_),_X_);}
    caml_update_dummy
     (render_oB_,
      /*<<49163: src/draw.ml 361 18 81>>*/function(param_pl_)
       {switch(param_pl_[0])
         {case 1:
           var
            trans_pn_=param_pl_[2],
            match_pm_=_cL_(render_oB_,param_pl_[1]),
            elt_po_=match_pm_[1],
            sub_pp_=match_pm_[2];
           return [0,
                   elt_po_,
                   _eb_
                    (_mg_,_mS_(elt_po_,_az_,map_mm_(trans_pn_,_ow_)),sub_pp_)];
          case 2:
           var
            pts_pq_=param_pl_[3],
            props_ps_=param_pl_[2],
            name_pr_=param_pl_[1][1],
            _pt_=[0,_ax_,_jC_(_ay_,_jx_(peek_mk_(pts_pq_),_nt_))],
            elt_pu_=
             _mV_
              (_av_,
               [0,
                [0,_aw_,render_properties_oz_(_jx_(props_ps_,peek_mk_))],
                _pt_]),
            _pw_=mk_name_sub_pv_(name_pr_,elt_pu_);
           return [0,
                   elt_pu_,
                   _cL_(_mh_,[0,_mS_(elt_pu_,_au_,map_mm_(pts_pq_,_ny_)),_pw_])];
          case 3:
           var
            segs_px_=param_pl_[5],
            mask_pC_=param_pl_[4],
            anchor_pB_=param_pl_[3],
            props_pA_=param_pl_[2],
            name_pz_=param_pl_[1][1],
            elt_py_=_mV_(_at_,[0]),
            _pE_=mk_name_sub_pv_(name_pz_,elt_py_),
            _pJ_=path_mask_pD_(elt_py_,segs_px_,mask_pC_,props_pA_);
           return [0,
                   elt_py_,
                   _cL_
                    (_mh_,
                     [0,
                      _mS_
                       (elt_py_,
                        _as_,
                        zip_with_mn_
                         (anchor_pB_,
                          segs_px_,
                          function(param_pF_,sgs_pG_)
                           {var y_pI_=param_pF_[2],x_pH_=param_pF_[1];
                            return _nD_
                                    (_h0_,_aF_,x_pH_,y_pI_,_jC_(_U_,_jx_(sgs_pG_,_oy_)));})),
                      _pJ_,
                      _pE_])];
          case 4:
           var
            path_strb_pK_=param_pl_[4],
            mask_pO_=param_pl_[3],
            props_pN_=param_pl_[2],
            name_pM_=param_pl_[1][1],
            elt_pL_=_mV_(_ar_,[0]),
            _pP_=mk_name_sub_pv_(name_pM_,elt_pL_),
            _pQ_=path_mask_pD_(elt_pL_,path_strb_pK_,mask_pO_,props_pN_);
           return [0,
                   elt_pL_,
                   _cL_(_mh_,[0,_mS_(elt_pL_,_aq_,path_strb_pK_),_pQ_,_pP_])];
          case 5:
           var
            text_pR_=param_pl_[4],
            corner_pS_=param_pl_[3],
            ps_pV_=param_pl_[2],
            name_pU_=param_pl_[1][1],
            elt_pT_=_mV_(_ap_,[0]),
            name_sub_pW_=mk_name_sub_pv_(name_pU_,elt_pT_);
           _mT_(elt_pT_,peek_mk_(text_pR_));
           var
            _pX_=_cL_(stop_on_removal_mC_,wrap_mA_(elt_pT_)),
            _pY_=_cL_(_mT_,elt_pT_),
            _pZ_=_j6_(iter_mj_(_mo_(text_pR_),_pY_),_pX_),
            _p1_=[0,_ao_,zip_props_pe_(ps_pV_)],
            _p3_=[0,_an_,y_beh_p0_(corner_pS_)];
           return [0,
                   elt_pT_,
                   _cL_
                    (_mh_,
                     [0,
                      name_sub_pW_,
                      _pZ_,
                      sink_attrs_oA_
                       (elt_pT_,[0,[0,_am_,x_beh_p2_(corner_pS_)],_p3_,_p1_])])];
          case 6:
           var
            hb_p4_=param_pl_[5],
            wb_p5_=param_pl_[4],
            corner_p6_=param_pl_[3],
            ps_p8_=param_pl_[2],
            match_p7_=peek_mk_(corner_p6_),
            y_p__=match_p7_[2],
            x_p9_=match_p7_[1],
            _p$_=[0,_al_,render_properties_oz_(_jx_(ps_p8_,peek_mk_))],
            _qa_=[0,_ak_,string_of_float_j3_(peek_mk_(hb_p4_))],
            _qb_=[0,_aj_,string_of_float_j3_(peek_mk_(wb_p5_))],
            _qc_=[0,_ai_,string_of_float_j3_(y_p__)],
            elt_qd_=
             _mV_
              (_ag_,
               [0,[0,_ah_,string_of_float_j3_(x_p9_)],_qc_,_qb_,_qa_,_p$_]),
            _qe_=[0,_af_,map_mm_(hb_p4_,string_of_float_j3_)],
            _qf_=[0,_ae_,map_mm_(wb_p5_,string_of_float_j3_)],
            _qg_=[0,_ad_,y_beh_p0_(corner_p6_)];
           return [0,
                   elt_qd_,
                   sink_attrs_oA_
                    (elt_qd_,[0,[0,_ac_,x_beh_p2_(corner_p6_)],_qg_,_qf_,_qe_])];
          case 7:
           var elts_qh_=_jx_(param_pl_[1],render_oB_),elt_qi_=_mV_(_ab_,[0]);
           _jy_
            (elts_qh_,
             /*<<49131: src/draw.ml 466 23 52>>*/function(param_qj_)
              {return _mU_(elt_qi_,param_qj_[1]);});
           return [0,
                   elt_qi_,
                   _cL_(_mh_,_jx_(elts_qh_,function(_qk_){return _qk_[2];}))];
          case 8:
           var
            heightb_qo_=param_pl_[3],
            widthb_qn_=param_pl_[2],
            urlb_qm_=param_pl_[1],
            elt_ql_=_mV_(_aa_,[0]),
            _qq_=[0,_$_,map_mm_(heightb_qo_,pixel_str_of_int_qp_)];
           return [0,
                   elt_ql_,
                   sink_attrs_oA_
                    (elt_ql_,
                     [0,
                      [0,_Z_,urlb_qm_],
                      [0,___,map_mm_(widthb_qn_,pixel_str_of_int_qp_)],
                      _qq_])];
          case 9:
           var
            tb_qr_=param_pl_[1],
            container_qs_=_mV_(_Y_,[0]),
            match_qt_=_cL_(render_oB_,peek_mk_(tb_qr_)),
            sub_qu_=match_qt_[2];
           _mU_(container_qs_,match_qt_[1]);
           var
            last_sub_qv_=[0,sub_qu_],
            _qA_=
             /*<<49094: src/draw.ml 475 6 22>>*/function(t_qx_)
              {/*<<49094: src/draw.ml 475 6 22>>*/_j9_(last_sub_qv_[1]);
               /*<<48110: src/jq.ml 97 6 71>>*/for(;;)
                {if(1-(container_qs_.firstChild==null_ic_?1:0))
                  {var _qw_=container_qs_.firstChild;
                   if(_qw_!=null_ic_)
                    /*<<48065: src/jq.ml 97 44 70>>*/container_qs_.removeChild
                     (_qw_);
                   continue;}
                 var match_qy_=_cL_(render_oB_,t_qx_),sub_qz_=match_qy_[2];
                 _mU_(container_qs_,match_qy_[1]);
                 last_sub_qv_[1]=sub_qz_;
                 return 0;}},
            dyn_sub_qC_=iter_mj_(_mo_(tb_qr_),_qA_);
           return [0,
                   container_qs_,
                   _eb_
                    (_mg_,
                     dyn_sub_qC_,
                     _lD_
                      (/*<<49086: src/draw.ml 482 61 77>>*/function(param_qB_)
                        {return _j9_(last_sub_qv_[1]);}))];
          case 10:return [0,param_pl_[1],_mf_];
          default:
           var
            center_qD_=param_pl_[4],
            r_qH_=param_pl_[3],
            ps_qG_=param_pl_[2],
            name_qF_=param_pl_[1][1],
            elt_qE_=_mV_(_aE_,[0]),
            name_sub_qI_=mk_name_sub_pv_(name_qF_,elt_qE_),
            _qJ_=[0,_aD_,zip_props_pe_(ps_qG_)],
            _qK_=[0,_aC_,map_mm_(r_qH_,string_of_float_j3_)],
            _qL_=[0,_aB_,y_beh_p0_(center_qD_)];
           return [0,
                   elt_qE_,
                   _eb_
                    (_mg_,
                     name_sub_qI_,
                     sink_attrs_oA_
                      (elt_qE_,[0,[0,_aA_,x_beh_p2_(center_qD_)],_qL_,_qK_,_qJ_]))];}});
    var
     t_qM_=unsafe_jq_mR_(_m_),
     _qN_=0===t_qM_.length?0:[0,t_qM_],
     main_container_qO_=_jh_(_qN_),
     height_q7_=match_f_[2],
     width_q6_=match_f_[1],
     centers_q5_=[0,_j_,_k_,_l_],
     circles_q8_=
      _jx_
       (centers_q5_,
        /*<<53104: src/circles.ml 17 39 61>>*/function(ctr_qY_)
         {var
           scale_qP_=1073741824,
           r1_qQ_=_h5_(_h6_),
           _qT_=(r1_qQ_/scale_qP_+_h5_(_h6_))/scale_qP_*80;
          function _qZ_(_qU_)
           {return _mp_(_qU_,_qT_,function(param_qS_,x_qR_){return x_qR_;});}
          /*<<53117: src/circles.ml 12 4 60>>*/function _q4_(pos_qW_)
           {var _qX_=_jf_(function(_qV_){return _qV_;},pos_qW_);
            return 8e3/
                   Math.sqrt
                    (Math.pow(_qX_[1]-ctr_qY_[1],2)+
                     Math.pow(_qX_[2]-ctr_qY_[2],2));}
          return [0,
                  ctr_qY_,
                  _j6_
                   (map_lQ_
                     (map_lQ_
                       (mouse_pos_nk_,
                        /*<<47640: src/jq.ml 190 35 53>>*/function(param_q0_)
                         {var
                           y_q3_=param_q0_[2],
                           x_q2_=param_q0_[1],
                           o_q1_=main_container_qO_.offset();
                          return [0,
                                  x_q2_-o_q1_[_aK_.toString()]|0,
                                  y_q3_-o_q1_[_aL_.toString()]|0];}),
                      _q4_),
                    _qZ_)];});
    /*<<52885: src/circles.ml 38 14 4>>*/function draw_line_rr_(param_q9_)
     {var y0_q__=param_q9_[2],far_x_q$_=3e3;
      return [0,
              [1,[0,0,y0_q__]],
              [0,[0,far_x_q$_,far_x_q$_*param_q9_[1]+y0_q__]]];}
    function tangent_lines_rM_(param_rc_,_ra_)
     {var
       c2_rb_=_ra_[1],
       c1_rd_=param_rc_[1],
       r2b_rt_=_ra_[2],
       r1b_rs_=param_rc_[2],
       segs_b_ru_=
        zip_with_mn_
         (r1b_rs_,
          r2b_rt_,
          function(r1_rj_,r2_ri_)
           {var
             y1_re_=c1_rd_[2],
             x1_rf_=c1_rd_[1],
             _rg_=c2_rb_[2]-y1_re_,
             _rh_=c2_rb_[1]-x1_rf_,
             d_rk_=Math.sqrt(Math.pow(_rh_,2)+Math.pow(_rg_,2)),
             nx_rl_=_rh_/d_rk_,
             ny_rm_=_rg_/d_rk_,
             nr_rn_=(r2_ri_-r1_rj_)/d_rk_;
            return _jf_
                    (draw_line_rr_,
                     _jf_
                      (/*<<52922: src/circles.ml 33 14 41>>*/function(k_ro_)
                        {var
                          _rp_=
                           nr_rn_*
                           nx_rl_-
                           k_ro_*
                           ny_rm_*
                           Math.sqrt(1-Math.pow(nr_rn_,2)),
                          _rq_=
                           nr_rn_*
                           ny_rm_+
                           k_ro_*
                           nx_rl_*
                           Math.sqrt(1-Math.pow(nr_rn_,2));
                         return [0,
                                 -_rp_/_rq_,
                                 -(r1_rj_-(_rp_*x1_rf_+_rq_*y1_re_))/_rq_];},
                       _n_));}),
       _rv_=_ia_(256),
       _rw_=_ia_(256),
       _rx_=[0,_ia_(256),_rw_,_rv_,1],
       _rz_=map_mm_(segs_b_ru_,function(_ry_){return _ry_[2];}),
       _rA_=return_ml_(_p_),
       _rC_=path_ox_(0,[0,[0,return_ml_(_ov_(0,0,_rx_,2))]],0,_rA_,_rz_),
       _rD_=map_mm_(segs_b_ru_,function(_rB_){return _rB_[1];}),
       _rE_=return_ml_(_o_);
      return [0,
              path_ox_(0,[0,[0,return_ml_(_ov_(0,0,_rx_,2))]],0,_rE_,_rD_),
              _rC_];}
    var
     _rN_=0,
     _rO_=
      [0,
       _jx_
        (circles_q8_,
         /*<<52621: src/circles.ml 62 16 88>>*/function(param_rF_)
          {var
            r_rG_=param_rF_[2],
            _rH_=return_ml_(param_rF_[1]),
            _rI_=return_ml_(_ov_(0,0,_q_,2)),
            _rJ_=[0,return_ml_([0,_ou_]),_rI_],
            _rL_=0,
            props_rK_=[0,_rJ_]?_rJ_:[0];
           return [0,[0,_rL_],props_rK_,r_rG_,_rH_];}),
       _rN_],
     _rP_=
      [0,
       tangent_lines_rM_
        (caml_array_get(circles_q8_,2),caml_array_get(circles_q8_,0)),
       _rO_],
     _rQ_=
      [0,
       tangent_lines_rM_
        (caml_array_get(circles_q8_,1),caml_array_get(circles_q8_,2)),
       _rP_],
     elt_rR_=
      _cL_
        (render_oB_,
         [7,
          caml_array_concat
           ([0,
             tangent_lines_rM_
              (caml_array_get(circles_q8_,0),caml_array_get(circles_q8_,1)),
             _rQ_])])
       [1],
     _rS_=[0,_aI_,string_of_int_b4_(height_q7_)],
     svg_rT_=_mV_(_aG_,[0,[0,_aH_,string_of_int_b4_(width_q6_)],_rS_]);
    _mU_(svg_rT_,elt_rR_);
    var _rW_=main_container_qO_.get(0);
    /*<<24991: js.ml 98 54 60>>*/function _rX_(x_rU_){return [0,x_rU_];}
    _mU_
     (_jh_
       (_ih_
         (_rW_,
          /*<<24988: js.ml 98 38 42>>*/function(param_rV_){return 0;},
          _rX_)),
      svg_rT_);
    do_at_exit_b5_(0);
    return;}
  ());
