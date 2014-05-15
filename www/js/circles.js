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
   {function _nI_(_sV_,_sW_,_sX_,_sY_,_sZ_,_s0_,_s1_,_s2_)
     {return _sV_.length==7
              ?_sV_(_sW_,_sX_,_sY_,_sZ_,_s0_,_s1_,_s2_)
              :caml_call_gen(_sV_,[_sW_,_sX_,_sY_,_sZ_,_s0_,_s1_,_s2_]);}
    function _h0_(_sO_,_sP_,_sQ_,_sR_,_sS_,_sT_,_sU_)
     {return _sO_.length==6
              ?_sO_(_sP_,_sQ_,_sR_,_sS_,_sT_,_sU_)
              :caml_call_gen(_sO_,[_sP_,_sQ_,_sR_,_sS_,_sT_,_sU_]);}
    function _nA_(_sI_,_sJ_,_sK_,_sL_,_sM_,_sN_)
     {return _sI_.length==5
              ?_sI_(_sJ_,_sK_,_sL_,_sM_,_sN_)
              :caml_call_gen(_sI_,[_sJ_,_sK_,_sL_,_sM_,_sN_]);}
    function _nH_(_sD_,_sE_,_sF_,_sG_,_sH_)
     {return _sD_.length==4
              ?_sD_(_sE_,_sF_,_sG_,_sH_)
              :caml_call_gen(_sD_,[_sE_,_sF_,_sG_,_sH_]);}
    function _dM_(_sz_,_sA_,_sB_,_sC_)
     {return _sz_.length==3
              ?_sz_(_sA_,_sB_,_sC_)
              :caml_call_gen(_sz_,[_sA_,_sB_,_sC_]);}
    function _ef_(_sw_,_sx_,_sy_)
     {return _sw_.length==2?_sw_(_sx_,_sy_):caml_call_gen(_sw_,[_sx_,_sy_]);}
    function _cP_(_su_,_sv_)
     {return _su_.length==1?_su_(_sv_):caml_call_gen(_su_,[_sv_]);}
    var
     _a_=[0,new MlString("Failure")],
     _b_=[0,new MlString("Invalid_argument")],
     _c_=[0,new MlString("Not_found")],
     _d_=[0,0,0],
     _e_=[0,0,0,0,1],
     _f_=[0,0,0,255,1],
     match_g_=[0,3e3,1e3];
    caml_register_global(6,_c_);
    caml_register_global(5,[0,new MlString("Division_by_zero")]);
    caml_register_global(3,_b_);
    caml_register_global(2,_a_);
    var
     _bT_=[0,new MlString("Assert_failure")],
     _bS_=new MlString("%d"),
     _bR_=new MlString("true"),
     _bQ_=new MlString("false"),
     _bP_=new MlString("Pervasives.do_at_exit"),
     _bO_=new MlString("\\b"),
     _bN_=new MlString("\\t"),
     _bM_=new MlString("\\n"),
     _bL_=new MlString("\\r"),
     _bK_=new MlString("\\\\"),
     _bJ_=new MlString("\\'"),
     _bI_=new MlString("String.blit"),
     _bH_=new MlString("String.sub"),
     _bG_=new MlString("Buffer.add: cannot grow buffer"),
     _bF_=new MlString(""),
     _bE_=new MlString(""),
     _bD_=new MlString("%.12g"),
     _bC_=new MlString("\""),
     _bB_=new MlString("\""),
     _bA_=new MlString("'"),
     _bz_=new MlString("'"),
     _by_=new MlString("nan"),
     _bx_=new MlString("neg_infinity"),
     _bw_=new MlString("infinity"),
     _bv_=new MlString("."),
     _bu_=new MlString("printf: bad positional specification (0)."),
     _bt_=new MlString("%_"),
     _bs_=[0,new MlString("printf.ml"),143,8],
     _br_=new MlString("'"),
     _bq_=new MlString("Printf: premature end of format string '"),
     _bp_=new MlString("'"),
     _bo_=new MlString(" in format string '"),
     _bn_=new MlString(", at char number "),
     _bm_=new MlString("Printf: bad conversion %"),
     _bl_=new MlString("Sformat.index_of_int: negative argument "),
     _bk_=new MlString("Random.int"),
     _bj_=
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
     _bi_=new MlString("\\$&"),
     _bh_=new MlString("g"),
     _bg_=new MlString("g"),
     _bf_=new MlString("[$]"),
     _be_=new MlString("[\\][()\\\\|+*.?{}^$]"),
     _bd_=[0,new MlString(""),0],
     _bc_=new MlString(""),
     _bb_=new MlString(" "),
     _ba_=new MlString("Url.Local_exn"),
     _a$_=new MlString("+"),
     _a__=new MlString("g"),
     _a9_=new MlString("\\+"),
     _a8_=
      new
       MlString
       ("^([Hh][Tt][Tt][Pp][Ss]?)://([0-9a-zA-Z.-]+|\\[[0-9a-zA-Z.-]+\\]|\\[[0-9A-Fa-f:.]+\\])?(:([0-9]+))?/([^\\?#]*)(\\?([^#]*))?(#(.*))?$"),
     _a7_=
      new MlString("^([Ff][Ii][Ll][Ee])://([^\\?#]*)(\\?([^#]*))?(#(.*))?$"),
     _a6_=new MlString("Option.value_exn: None"),
     _a5_=
      new
       MlString
       ("(function(a,f){var len=a.length;for(var i = 0; i < len; ++i){f(a[i]);}})"),
     _a4_=new MlString(""),
     _a3_=new MlString("iter"),
     _a2_=
      new
       MlString
       ("(function(t, x0, f){for(var k in t){if(t.hasOwnProperty(k)){x0=f(x0,parseInt(k),t[k]);}} return x0;})"),
     _a1_=
      new
       MlString
       ("(function(t, f){for(var k in t){if(t.hasOwnProperty(k)){f(parseInt(k),t[k]);}}})"),
     _a0_=new MlString("(function(x,y){return x % y;})"),
     _aZ_=
      new MlString("Stream.turn_on_derived: Listener was not off or passive"),
     _aY_=new MlString("Stream.turn_off_derived: Listener was not on"),
     _aX_=new MlString("Stream.Prim.turn_off: Listener was not on or passive"),
     _aW_=new MlString("Stream.Prim.turn_on: Listener was not off or passive"),
     _aV_=new MlString("pageY"),
     _aU_=new MlString("pageX"),
     _aT_=new MlString("mousemove"),
     _aS_=new MlString("which"),
     _aR_=new MlString("keyup"),
     _aQ_=new MlString("keydown"),
     _aP_=new MlString("http://www.w3.org/2000/svg"),
     _aO_=new MlString("removal"),
     _aN_=new MlString("top"),
     _aM_=new MlString("left"),
     _aL_=new MlString("body"),
     _aK_=new MlString("height"),
     _aJ_=new MlString("width"),
     _aI_=new MlString("svg"),
     _aH_=new MlString("M%f,%f %s"),
     _aG_=new MlString("circle"),
     _aF_=new MlString("style"),
     _aE_=new MlString("r"),
     _aD_=new MlString("cy"),
     _aC_=new MlString("cx"),
     _aB_=new MlString("transform"),
     _aA_=[0,new MlString(",")],
     _az_=new MlString("points"),
     _ay_=new MlString("style"),
     _ax_=new MlString("polygon"),
     _aw_=new MlString("points"),
     _av_=new MlString("path"),
     _au_=new MlString("d"),
     _at_=new MlString("path"),
     _as_=new MlString("d"),
     _ar_=new MlString("text"),
     _aq_=new MlString("style"),
     _ap_=new MlString("y"),
     _ao_=new MlString("x"),
     _an_=new MlString("style"),
     _am_=new MlString("height"),
     _al_=new MlString("width"),
     _ak_=new MlString("y"),
     _aj_=new MlString("x"),
     _ai_=new MlString("rect"),
     _ah_=new MlString("height"),
     _ag_=new MlString("width"),
     _af_=new MlString("y"),
     _ae_=new MlString("x"),
     _ad_=new MlString("g"),
     _ac_=new MlString("image"),
     _ab_=new MlString("height"),
     _aa_=new MlString("width"),
     _$_=new MlString("xlink:href"),
     ___=new MlString("g"),
     _Z_=new MlString("px"),
     _Y_=new MlString("style"),
     _X_=[0,new MlString(";")],
     _W_=[0,new MlString(" ")],
     _V_=new MlString("L%f %f"),
     _U_=new MlString("M%f %f"),
     _T_=new MlString("A%f,%f 0 %d,%d %f,%f"),
     _S_=new MlString("a%f,%f 0 %d,1 %f,%f"),
     _R_=new MlString("fill:"),
     _Q_=new MlString("stroke-linejoin:"),
     _P_=new MlString("stroke-linecap:"),
     _O_=new MlString("stroke-width:"),
     _N_=new MlString("stroke:"),
     _M_=[0,new MlString(";")],
     _L_=[0,new MlString(" ")],
     _K_=new MlString("stroke-dasharray:"),
     _J_=new MlString("%s:%s"),
     _I_=new MlString("miter"),
     _H_=new MlString("bevel"),
     _G_=new MlString("round"),
     _F_=new MlString("butt"),
     _E_=new MlString("round"),
     _D_=new MlString("square"),
     _C_=[0,new MlString(" ")],
     _B_=new MlString("matrix(%f,%f,%f,%f,%f,%f)"),
     _A_=new MlString("translate(%f %f)"),
     _z_=new MlString("scale(%f %f)"),
     _y_=new MlString("rotate(%f %f %f)"),
     _x_=new MlString("skewX(%f)"),
     _w_=new MlString("skewY(%f)"),
     _v_=new MlString("rgba(%d,%d,%d,%f)"),
     _u_=[0,new MlString(" ")],
     _t_=new MlString(","),
     _s_=[0,0,0],
     _r_=[0,0,0],
     _q_=[0,0,0],
     _p_=[0,1,-1],
     _o_=new MlString("#circles"),
     _n_=[0,600,450],
     _m_=[0,350,360],
     _l_=[0,400,170],
     _k_=[0,0,0];
    /*<<990: pervasives.ml 20 17 33>>*/function _j_(s_h_){throw [0,_a_,s_h_];}
    /*<<984: pervasives.ml 21 20 45>>*/function _bU_(s_i_)
     {throw [0,_b_,s_i_];}
    function _b5_(s1_bV_,s2_bX_)
     {var
       l1_bW_=s1_bV_.getLen(),
       l2_bY_=s2_bX_.getLen(),
       s_bZ_=caml_create_string(l1_bW_+l2_bY_|0);
      caml_blit_string(s1_bV_,0,s_bZ_,0,l1_bW_);
      caml_blit_string(s2_bX_,0,s_bZ_,l1_bW_,l2_bY_);
      return s_bZ_;}
    /*<<846: pervasives.ml 186 2 19>>*/function string_of_int_b6_(n_b0_)
     {return caml_format_int(_bS_,n_b0_);}
    /*<<220: pervasives.ml 451 20 39>>*/function do_at_exit_b7_(param_b4_)
     {var param_b1_=caml_ml_out_channels_list(0);
      /*<<720: pervasives.ml 253 17 50>>*/for(;;)
       {if(param_b1_)
         {var l_b2_=param_b1_[2];
          try {}catch(_b3_){}
          var param_b1_=l_b2_;
          continue;}
        return 0;}}
    caml_register_named_value(_bP_,do_at_exit_b7_);
    function _b9_(_b8_){return caml_array_concat(_b8_);}
    function _ck_(n_b__,c_ca_)
     {var s_b$_=caml_create_string(n_b__);
      caml_fill_string(s_b$_,0,n_b__,c_ca_);
      return s_b$_;}
    function _cl_(s_cd_,ofs_cb_,len_cc_)
     {if(0<=ofs_cb_&&0<=len_cc_&&!((s_cd_.getLen()-len_cc_|0)<ofs_cb_))
       {var r_ce_=caml_create_string(len_cc_);
        /*<<6675: string.ml 41 7 5>>*/caml_blit_string
         (s_cd_,ofs_cb_,r_ce_,0,len_cc_);
        return r_ce_;}
      return _bU_(_bH_);}
    function _cm_(s1_ch_,ofs1_cg_,s2_cj_,ofs2_ci_,len_cf_)
     {if
       (0<=
        len_cf_&&
        0<=
        ofs1_cg_&&
        !((s1_ch_.getLen()-len_cf_|0)<ofs1_cg_)&&
        0<=
        ofs2_ci_&&
        !((s2_cj_.getLen()-len_cf_|0)<ofs2_ci_))
       return caml_blit_string(s1_ch_,ofs1_cg_,s2_cj_,ofs2_ci_,len_cf_);
      return _bU_(_bI_);}
    var
     _cn_=caml_sys_const_word_size(0),
     _co_=caml_mul(_cn_/8|0,(1<<(_cn_-10|0))-1|0)-1|0;
    /*<<11355: buffer.ml 23 1 59>>*/function _cG_(n_cp_)
     {var
       n_cq_=1<=n_cp_?n_cp_:1,
       n_cr_=_co_<n_cq_?_co_:n_cq_,
       s_cs_=caml_create_string(n_cr_);
      return [0,s_cs_,0,n_cr_,s_cs_];}
    /*<<11345: buffer.ml 28 17 49>>*/function _cH_(b_ct_)
     {return _cl_(b_ct_[1],0,b_ct_[2]);}
    function _cA_(b_cu_,more_cw_)
     {var new_len_cv_=[0,b_cu_[3]];
      for(;;)
       {if(new_len_cv_[1]<(b_cu_[2]+more_cw_|0))
         {new_len_cv_[1]=2*new_len_cv_[1]|0;continue;}
        if(_co_<new_len_cv_[1])
         if((b_cu_[2]+more_cw_|0)<=_co_)
          /*<<11153: buffer.ml 68 9 41>>*/new_len_cv_[1]=_co_;
         else
          /*<<11160: buffer.ml 69 9 50>>*/_j_(_bG_);
        var new_buffer_cx_=caml_create_string(new_len_cv_[1]);
        /*<<11166: buffer.ml 69 9 50>>*/_cm_
         (b_cu_[1],0,new_buffer_cx_,0,b_cu_[2]);
        /*<<11166: buffer.ml 69 9 50>>*/b_cu_[1]=new_buffer_cx_;
        /*<<11166: buffer.ml 69 9 50>>*/b_cu_[3]=new_len_cv_[1];
        return 0;}}
    function _cI_(b_cy_,c_cB_)
     {var pos_cz_=b_cy_[2];
      if(b_cy_[3]<=pos_cz_)/*<<11090: buffer.ml 78 26 36>>*/_cA_(b_cy_,1);
      /*<<11094: buffer.ml 78 26 36>>*/b_cy_[1].safeSet(pos_cz_,c_cB_);
      /*<<11094: buffer.ml 78 26 36>>*/b_cy_[2]=pos_cz_+1|0;
      return 0;}
    function _cJ_(b_cE_,s_cC_)
     {var len_cD_=s_cC_.getLen(),new_position_cF_=b_cE_[2]+len_cD_|0;
      if(b_cE_[3]<new_position_cF_)
       /*<<10992: buffer.ml 93 34 46>>*/_cA_(b_cE_,len_cD_);
      /*<<10996: buffer.ml 93 34 46>>*/_cm_(s_cC_,0,b_cE_[1],b_cE_[2],len_cD_);
      /*<<10996: buffer.ml 93 34 46>>*/b_cE_[2]=new_position_cF_;
      return 0;}
    /*<<15034: printf.ml 32 4 80>>*/function index_of_int_cN_(i_cK_)
     {return 0<=i_cK_?i_cK_:_j_(_b5_(_bl_,string_of_int_b6_(i_cK_)));}
    function add_int_index_cO_(i_cL_,idx_cM_)
     {return index_of_int_cN_(i_cL_+idx_cM_|0);}
    var _cQ_=_cP_(add_int_index_cO_,1);
    /*<<15000: printf.ml 58 22 66>>*/function _cX_(fmt_cR_)
     {return _cl_(fmt_cR_,0,fmt_cR_.getLen());}
    function bad_conversion_cZ_(sfmt_cS_,i_cT_,c_cV_)
     {var
       _cU_=_b5_(_bo_,_b5_(sfmt_cS_,_bp_)),
       _cW_=_b5_(_bn_,_b5_(string_of_int_b6_(i_cT_),_cU_));
      return _bU_(_b5_(_bm_,_b5_(_ck_(1,c_cV_),_cW_)));}
    function bad_conversion_format_dS_(fmt_cY_,i_c1_,c_c0_)
     {return bad_conversion_cZ_(_cX_(fmt_cY_),i_c1_,c_c0_);}
    /*<<14913: printf.ml 75 2 34>>*/function incomplete_format_dT_(fmt_c2_)
     {return _bU_(_b5_(_bq_,_b5_(_cX_(fmt_c2_),_br_)));}
    function extract_format_do_(fmt_c3_,start_c$_,stop_db_,widths_dd_)
     {/*<<14645: printf.ml 123 4 16>>*/function skip_positional_spec_c__
       (start_c4_)
       {if
         ((fmt_c3_.safeGet(start_c4_)-48|0)<
          0||
          9<
          (fmt_c3_.safeGet(start_c4_)-48|0))
         return start_c4_;
        var i_c5_=start_c4_+1|0;
        /*<<14616: printf.ml 126 8 20>>*/for(;;)
         {var _c6_=fmt_c3_.safeGet(i_c5_);
          if(48<=_c6_)
           {if(!(58<=_c6_)){var _c8_=i_c5_+1|0,i_c5_=_c8_;continue;}
            var _c7_=0;}
          else
           if(36===_c6_){var _c9_=i_c5_+1|0,_c7_=1;}else var _c7_=0;
          if(!_c7_)var _c9_=start_c4_;
          return _c9_;}}
      var
       start_da_=skip_positional_spec_c__(start_c$_+1|0),
       b_dc_=_cG_((stop_db_-start_da_|0)+10|0);
      _cI_(b_dc_,37);
      var l1_de_=widths_dd_,l2_df_=0;
      for(;;)
       {if(l1_de_)
         {var
           l_dg_=l1_de_[2],
           _dh_=[0,l1_de_[1],l2_df_],
           l1_de_=l_dg_,
           l2_df_=_dh_;
          continue;}
        var i_di_=start_da_,widths_dj_=l2_df_;
        for(;;)
         {if(i_di_<=stop_db_)
           {var _dk_=fmt_c3_.safeGet(i_di_);
            if(42===_dk_)
             {if(widths_dj_)
               {var t_dl_=widths_dj_[2];
                _cJ_(b_dc_,string_of_int_b6_(widths_dj_[1]));
                var
                 i_dm_=skip_positional_spec_c__(i_di_+1|0),
                 i_di_=i_dm_,
                 widths_dj_=t_dl_;
                continue;}
              throw [0,_bT_,_bs_];}
            _cI_(b_dc_,_dk_);
            var _dn_=i_di_+1|0,i_di_=_dn_;
            continue;}
          return _cH_(b_dc_);}}}
    function extract_format_int_fi_
     (conv_du_,fmt_ds_,start_dr_,stop_dq_,widths_dp_)
     {var sfmt_dt_=extract_format_do_(fmt_ds_,start_dr_,stop_dq_,widths_dp_);
      if(78!==conv_du_&&110!==conv_du_)return sfmt_dt_;
      /*<<14534: printf.ml 155 4 8>>*/sfmt_dt_.safeSet
       (sfmt_dt_.getLen()-1|0,117);
      return sfmt_dt_;}
    function sub_format_dU_
     (incomplete_format_dB_,bad_conversion_format_dL_,conv_dQ_,fmt_dv_,i_dP_)
     {var len_dw_=fmt_dv_.getLen();
      function sub_fmt_dN_(c_dx_,i_dK_)
       {var close_dy_=40===c_dx_?41:125;
        /*<<14299: printf.ml 181 7 26>>*/function sub_dJ_(j_dz_)
         {var j_dA_=j_dz_;
          /*<<14299: printf.ml 181 7 26>>*/for(;;)
           {if(len_dw_<=j_dA_)return _cP_(incomplete_format_dB_,fmt_dv_);
            if(37===fmt_dv_.safeGet(j_dA_))
             {var _dC_=j_dA_+1|0;
              if(len_dw_<=_dC_)
               var _dD_=_cP_(incomplete_format_dB_,fmt_dv_);
              else
               {var _dE_=fmt_dv_.safeGet(_dC_),_dF_=_dE_-40|0;
                if(_dF_<0||1<_dF_)
                 {var _dG_=_dF_-83|0;
                  if(_dG_<0||2<_dG_)
                   var _dH_=1;
                  else
                   switch(_dG_)
                    {case 1:var _dH_=1;break;
                     case 2:var _dI_=1,_dH_=0;break;
                     default:var _dI_=0,_dH_=0;}
                  if(_dH_){var _dD_=sub_dJ_(_dC_+1|0),_dI_=2;}}
                else
                 var _dI_=0===_dF_?0:1;
                switch(_dI_)
                 {case 1:
                   var
                    _dD_=
                     _dE_===close_dy_
                      ?_dC_+1|0
                      :_dM_(bad_conversion_format_dL_,fmt_dv_,i_dK_,_dE_);
                   break;
                  case 2:break;
                  default:var _dD_=sub_dJ_(sub_fmt_dN_(_dE_,_dC_+1|0)+1|0);}}
              return _dD_;}
            var _dO_=j_dA_+1|0,j_dA_=_dO_;
            continue;}}
        return sub_dJ_(i_dK_);}
      return sub_fmt_dN_(conv_dQ_,i_dP_);}
    /*<<14293: printf.ml 199 2 57>>*/function sub_format_for_printf_ei_
     (conv_dR_)
     {return _dM_
              (sub_format_dU_,
               incomplete_format_dT_,
               bad_conversion_format_dS_,
               conv_dR_);}
    function iter_on_format_args_ey_(fmt_dV_,add_conv_d6_,add_char_ee_)
     {var lim_dW_=fmt_dV_.getLen()-1|0;
      /*<<14233: printf.ml 254 4 10>>*/function scan_fmt_eg_(i_dX_)
       {var i_dY_=i_dX_;
        a:
        /*<<14233: printf.ml 254 4 10>>*/for(;;)
         {if(i_dY_<lim_dW_)
           {if(37===fmt_dV_.safeGet(i_dY_))
             {var skip_dZ_=0,i_d0_=i_dY_+1|0;
              for(;;)
               {if(lim_dW_<i_d0_)
                 var _d1_=incomplete_format_dT_(fmt_dV_);
                else
                 {var _d2_=fmt_dV_.safeGet(i_d0_);
                  if(58<=_d2_)
                   {if(95===_d2_)
                     {var _d4_=i_d0_+1|0,_d3_=1,skip_dZ_=_d3_,i_d0_=_d4_;
                      continue;}}
                  else
                   if(32<=_d2_)
                    switch(_d2_-32|0)
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
                      case 13:var _d5_=i_d0_+1|0,i_d0_=_d5_;continue;
                      case 10:
                       var _d7_=_dM_(add_conv_d6_,skip_dZ_,i_d0_,105),i_d0_=_d7_;
                       continue;
                      default:var _d8_=i_d0_+1|0,i_d0_=_d8_;continue;}
                  var i_d9_=i_d0_;
                  c:
                  for(;;)
                   {if(lim_dW_<i_d9_)
                     var _d__=incomplete_format_dT_(fmt_dV_);
                    else
                     {var _d$_=fmt_dV_.safeGet(i_d9_);
                      if(126<=_d$_)
                       var _ea_=0;
                      else
                       switch(_d$_)
                        {case 78:
                         case 88:
                         case 100:
                         case 105:
                         case 111:
                         case 117:
                         case 120:
                          var _d__=_dM_(add_conv_d6_,skip_dZ_,i_d9_,105),_ea_=1;break;
                         case 69:
                         case 70:
                         case 71:
                         case 101:
                         case 102:
                         case 103:
                          var _d__=_dM_(add_conv_d6_,skip_dZ_,i_d9_,102),_ea_=1;break;
                         case 33:
                         case 37:
                         case 44:
                         case 64:var _d__=i_d9_+1|0,_ea_=1;break;
                         case 83:
                         case 91:
                         case 115:
                          var _d__=_dM_(add_conv_d6_,skip_dZ_,i_d9_,115),_ea_=1;break;
                         case 97:
                         case 114:
                         case 116:
                          var _d__=_dM_(add_conv_d6_,skip_dZ_,i_d9_,_d$_),_ea_=1;
                          break;
                         case 76:
                         case 108:
                         case 110:
                          var j_eb_=i_d9_+1|0;
                          if(lim_dW_<j_eb_)
                           {var _d__=_dM_(add_conv_d6_,skip_dZ_,i_d9_,105),_ea_=1;}
                          else
                           {var _ec_=fmt_dV_.safeGet(j_eb_)-88|0;
                            if(_ec_<0||32<_ec_)
                             var _ed_=1;
                            else
                             switch(_ec_)
                              {case 0:
                               case 12:
                               case 17:
                               case 23:
                               case 29:
                               case 32:
                                var
                                 _d__=
                                  _ef_
                                   (add_char_ee_,_dM_(add_conv_d6_,skip_dZ_,i_d9_,_d$_),105),
                                 _ea_=1,
                                 _ed_=0;
                                break;
                               default:var _ed_=1;}
                            if(_ed_)
                             {var _d__=_dM_(add_conv_d6_,skip_dZ_,i_d9_,105),_ea_=1;}}
                          break;
                         case 67:
                         case 99:
                          var _d__=_dM_(add_conv_d6_,skip_dZ_,i_d9_,99),_ea_=1;break;
                         case 66:
                         case 98:
                          var _d__=_dM_(add_conv_d6_,skip_dZ_,i_d9_,66),_ea_=1;break;
                         case 41:
                         case 125:
                          var _d__=_dM_(add_conv_d6_,skip_dZ_,i_d9_,_d$_),_ea_=1;
                          break;
                         case 40:
                          var
                           _d__=scan_fmt_eg_(_dM_(add_conv_d6_,skip_dZ_,i_d9_,_d$_)),
                           _ea_=1;
                          break;
                         case 123:
                          var
                           i_eh_=_dM_(add_conv_d6_,skip_dZ_,i_d9_,_d$_),
                           j_ej_=_dM_(sub_format_for_printf_ei_,_d$_,fmt_dV_,i_eh_),
                           i_ek_=i_eh_;
                          /*<<13855: printf.ml 240 8 63>>*/for(;;)
                           {if(i_ek_<(j_ej_-2|0))
                             {var
                               _el_=_ef_(add_char_ee_,i_ek_,fmt_dV_.safeGet(i_ek_)),
                               i_ek_=_el_;
                              continue;}
                            var _em_=j_ej_-1|0,i_d9_=_em_;
                            continue c;}
                         default:var _ea_=0;}
                      if(!_ea_)
                       var _d__=bad_conversion_format_dS_(fmt_dV_,i_d9_,_d$_);}
                    var _d1_=_d__;
                    break;}}
                var i_dY_=_d1_;
                continue a;}}
            var _en_=i_dY_+1|0,i_dY_=_en_;
            continue;}
          return i_dY_;}}
      scan_fmt_eg_(0);
      return 0;}
    /*<<13568: printf.ml 310 2 12>>*/function
     count_printing_arguments_of_format_gx_
     (fmt_ez_)
     {var ac_eo_=[0,0,0,0];
      function add_conv_ex_(skip_et_,i_eu_,c_ep_)
       {var _eq_=41!==c_ep_?1:0,_er_=_eq_?125!==c_ep_?1:0:_eq_;
        if(_er_)
         {var inc_es_=97===c_ep_?2:1;
          if(114===c_ep_)
           /*<<13624: printf.ml 295 20 48>>*/ac_eo_[3]=ac_eo_[3]+1|0;
          if(skip_et_)
           /*<<13633: printf.ml 297 9 39>>*/ac_eo_[2]=ac_eo_[2]+inc_es_|0;
          else
           /*<<13641: printf.ml 298 9 39>>*/ac_eo_[1]=ac_eo_[1]+inc_es_|0;}
        return i_eu_+1|0;}
      /*<<13649: printf.ml 292 2 4>>*/iter_on_format_args_ey_
       (fmt_ez_,add_conv_ex_,function(i_ev_,param_ew_){return i_ev_+1|0;});
      return ac_eo_[1];}
    function scan_positional_spec_fe_(fmt_eA_,got_spec_eD_,i_eB_)
     {var _eC_=fmt_eA_.safeGet(i_eB_);
      if((_eC_-48|0)<0||9<(_eC_-48|0))return _ef_(got_spec_eD_,0,i_eB_);
      var accu_eE_=_eC_-48|0,j_eF_=i_eB_+1|0;
      for(;;)
       {var _eG_=fmt_eA_.safeGet(j_eF_);
        if(48<=_eG_)
         {if(!(58<=_eG_))
           {var
             _eJ_=j_eF_+1|0,
             _eI_=(10*accu_eE_|0)+(_eG_-48|0)|0,
             accu_eE_=_eI_,
             j_eF_=_eJ_;
            continue;}
          var _eH_=0;}
        else
         if(36===_eG_)
          if(0===accu_eE_)
           {var _eK_=_j_(_bu_),_eH_=1;}
          else
           {var
             _eK_=
              _ef_(got_spec_eD_,[0,index_of_int_cN_(accu_eE_-1|0)],j_eF_+1|0),
             _eH_=1;}
         else
          var _eH_=0;
        if(!_eH_)var _eK_=_ef_(got_spec_eD_,0,i_eB_);
        return _eK_;}}
    function next_index_e$_(spec_eL_,n_eM_)
     {return spec_eL_?n_eM_:_cP_(_cQ_,n_eM_);}
    function get_index_e0_(spec_eN_,n_eO_){return spec_eN_?spec_eN_[1]:n_eO_;}
    function _hZ_
     (to_s_gS_,get_out_eQ_,outc_g4_,outs_eT_,flush_gC_,k_g__,fmt_eP_)
     {var out_eR_=_cP_(get_out_eQ_,fmt_eP_);
      /*<<11901: printf.ml 615 15 25>>*/function outs_gT_(s_eS_)
       {return _ef_(outs_eT_,out_eR_,s_eS_);}
      function pr_gB_(k_eY_,n_g9_,fmt_eU_,v_e3_)
       {var len_eX_=fmt_eU_.getLen();
        function doprn_gy_(n_g1_,i_eV_)
         {var i_eW_=i_eV_;
          for(;;)
           {if(len_eX_<=i_eW_)return _cP_(k_eY_,out_eR_);
            var _eZ_=fmt_eU_.safeGet(i_eW_);
            if(37===_eZ_)
             {var
               get_arg_e7_=
                function(spec_e2_,n_e1_)
                 {return caml_array_get(v_e3_,get_index_e0_(spec_e2_,n_e1_));},
               scan_flags_fb_=
                function(spec_fd_,n_e8_,widths_e__,i_e4_)
                 {var i_e5_=i_e4_;
                  for(;;)
                   {var _e6_=fmt_eU_.safeGet(i_e5_)-32|0;
                    if(!(_e6_<0||25<_e6_))
                     switch(_e6_)
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
                        return scan_positional_spec_fe_
                                (fmt_eU_,
                                 function(wspec_e9_,i_fc_)
                                  {var _fa_=[0,get_arg_e7_(wspec_e9_,n_e8_),widths_e__];
                                   return scan_flags_fb_
                                           (spec_fd_,next_index_e$_(wspec_e9_,n_e8_),_fa_,i_fc_);},
                                 i_e5_+1|0);
                       default:var _ff_=i_e5_+1|0,i_e5_=_ff_;continue;}
                    var _fg_=fmt_eU_.safeGet(i_e5_);
                    if(124<=_fg_)
                     var _fh_=0;
                    else
                     switch(_fg_)
                      {case 78:
                       case 88:
                       case 100:
                       case 105:
                       case 111:
                       case 117:
                       case 120:
                        var
                         x_fj_=get_arg_e7_(spec_fd_,n_e8_),
                         s_fk_=
                          caml_format_int
                           (extract_format_int_fi_(_fg_,fmt_eU_,i_eW_,i_e5_,widths_e__),
                            x_fj_),
                         _fm_=
                          cont_s_fl_(next_index_e$_(spec_fd_,n_e8_),s_fk_,i_e5_+1|0),
                         _fh_=1;
                        break;
                       case 69:
                       case 71:
                       case 101:
                       case 102:
                       case 103:
                        var
                         x_fn_=get_arg_e7_(spec_fd_,n_e8_),
                         s_fo_=
                          caml_format_float
                           (extract_format_do_(fmt_eU_,i_eW_,i_e5_,widths_e__),x_fn_),
                         _fm_=
                          cont_s_fl_(next_index_e$_(spec_fd_,n_e8_),s_fo_,i_e5_+1|0),
                         _fh_=1;
                        break;
                       case 76:
                       case 108:
                       case 110:
                        var _fp_=fmt_eU_.safeGet(i_e5_+1|0)-88|0;
                        if(_fp_<0||32<_fp_)
                         var _fq_=1;
                        else
                         switch(_fp_)
                          {case 0:
                           case 12:
                           case 17:
                           case 23:
                           case 29:
                           case 32:
                            var i_fr_=i_e5_+1|0,_fs_=_fg_-108|0;
                            if(_fs_<0||2<_fs_)
                             var _ft_=0;
                            else
                             {switch(_fs_)
                               {case 1:var _ft_=0,_fu_=0;break;
                                case 2:
                                 var
                                  x_fv_=get_arg_e7_(spec_fd_,n_e8_),
                                  _fw_=
                                   caml_format_int
                                    (extract_format_do_(fmt_eU_,i_eW_,i_fr_,widths_e__),x_fv_),
                                  _fu_=1;
                                 break;
                                default:
                                 var
                                  x_fx_=get_arg_e7_(spec_fd_,n_e8_),
                                  _fw_=
                                   caml_format_int
                                    (extract_format_do_(fmt_eU_,i_eW_,i_fr_,widths_e__),x_fx_),
                                  _fu_=1;}
                              if(_fu_){var s_fy_=_fw_,_ft_=1;}}
                            if(!_ft_)
                             {var
                               x_fz_=get_arg_e7_(spec_fd_,n_e8_),
                               s_fy_=
                                caml_int64_format
                                 (extract_format_do_(fmt_eU_,i_eW_,i_fr_,widths_e__),x_fz_);}
                            var
                             _fm_=
                              cont_s_fl_(next_index_e$_(spec_fd_,n_e8_),s_fy_,i_fr_+1|0),
                             _fh_=1,
                             _fq_=0;
                            break;
                           default:var _fq_=1;}
                        if(_fq_)
                         {var
                           x_fA_=get_arg_e7_(spec_fd_,n_e8_),
                           s_fB_=
                            caml_format_int
                             (extract_format_int_fi_(110,fmt_eU_,i_eW_,i_e5_,widths_e__),
                              x_fA_),
                           _fm_=
                            cont_s_fl_(next_index_e$_(spec_fd_,n_e8_),s_fB_,i_e5_+1|0),
                           _fh_=1;}
                        break;
                       case 37:
                       case 64:
                        var _fm_=cont_s_fl_(n_e8_,_ck_(1,_fg_),i_e5_+1|0),_fh_=1;
                        break;
                       case 83:
                       case 115:
                        var x_fC_=get_arg_e7_(spec_fd_,n_e8_);
                        if(115===_fg_)
                         var x_fD_=x_fC_;
                        else
                         {var n_fE_=[0,0],_fF_=0,_fG_=x_fC_.getLen()-1|0;
                          if(!(_fG_<_fF_))
                           {var i_fH_=_fF_;
                            for(;;)
                             {var
                               _fI_=x_fC_.safeGet(i_fH_),
                               _fJ_=
                                14<=_fI_
                                 ?34===_fI_?1:92===_fI_?1:0
                                 :11<=_fI_?13<=_fI_?1:0:8<=_fI_?1:0,
                               _fK_=_fJ_?2:caml_is_printable(_fI_)?1:4;
                              n_fE_[1]=n_fE_[1]+_fK_|0;
                              var _fL_=i_fH_+1|0;
                              if(_fG_!==i_fH_){var i_fH_=_fL_;continue;}
                              break;}}
                          if(n_fE_[1]===x_fC_.getLen())
                           var _fM_=x_fC_;
                          else
                           {var s__fN_=caml_create_string(n_fE_[1]);
                            /*<<5987: string.ml 115 33 9>>*/n_fE_[1]=0;
                            var _fO_=0,_fP_=x_fC_.getLen()-1|0;
                            if(!(_fP_<_fO_))
                             {var i_fQ_=_fO_;
                              for(;;)
                               {var _fR_=x_fC_.safeGet(i_fQ_),_fS_=_fR_-34|0;
                                if(_fS_<0||58<_fS_)
                                 if(-20<=_fS_)
                                  var _fT_=1;
                                 else
                                  {switch(_fS_+34|0)
                                    {case 8:
                                      /*<<6079: string.ml 130 16 67>>*/s__fN_.safeSet(n_fE_[1],92);
                                      /*<<6079: string.ml 130 16 67>>*/n_fE_[1]+=1;
                                      /*<<6079: string.ml 130 16 67>>*/s__fN_.safeSet(n_fE_[1],98);
                                      var _fU_=1;
                                      break;
                                     case 9:
                                      /*<<6096: string.ml 126 16 67>>*/s__fN_.safeSet(n_fE_[1],92);
                                      /*<<6096: string.ml 126 16 67>>*/n_fE_[1]+=1;
                                      /*<<6096: string.ml 126 16 67>>*/s__fN_.safeSet
                                       (n_fE_[1],116);
                                      var _fU_=1;
                                      break;
                                     case 10:
                                      /*<<6113: string.ml 124 16 67>>*/s__fN_.safeSet(n_fE_[1],92);
                                      /*<<6113: string.ml 124 16 67>>*/n_fE_[1]+=1;
                                      /*<<6113: string.ml 124 16 67>>*/s__fN_.safeSet
                                       (n_fE_[1],110);
                                      var _fU_=1;
                                      break;
                                     case 13:
                                      /*<<6130: string.ml 128 16 67>>*/s__fN_.safeSet(n_fE_[1],92);
                                      /*<<6130: string.ml 128 16 67>>*/n_fE_[1]+=1;
                                      /*<<6130: string.ml 128 16 67>>*/s__fN_.safeSet
                                       (n_fE_[1],114);
                                      var _fU_=1;
                                      break;
                                     default:var _fT_=1,_fU_=0;}
                                   if(_fU_)var _fT_=0;}
                                else
                                 var
                                  _fT_=
                                   (_fS_-1|0)<0||56<(_fS_-1|0)
                                    ?(s__fN_.safeSet(n_fE_[1],92),
                                      n_fE_[1]+=
                                      1,
                                      s__fN_.safeSet(n_fE_[1],_fR_),
                                      0)
                                    :1;
                                if(_fT_)
                                 if(caml_is_printable(_fR_))
                                  /*<<6159: string.ml 133 18 36>>*/s__fN_.safeSet
                                   (n_fE_[1],_fR_);
                                 else
                                  {/*<<6166: string.ml 134 21 19>>*/s__fN_.safeSet
                                    (n_fE_[1],92);
                                   /*<<6166: string.ml 134 21 19>>*/n_fE_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fN_.safeSet
                                    (n_fE_[1],48+(_fR_/100|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fE_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fN_.safeSet
                                    (n_fE_[1],48+((_fR_/10|0)%10|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fE_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fN_.safeSet
                                    (n_fE_[1],48+(_fR_%10|0)|0);}
                                n_fE_[1]+=1;
                                var _fV_=i_fQ_+1|0;
                                if(_fP_!==i_fQ_){var i_fQ_=_fV_;continue;}
                                break;}}
                            var _fM_=s__fN_;}
                          var x_fD_=_b5_(_bB_,_b5_(_fM_,_bC_));}
                        if(i_e5_===(i_eW_+1|0))
                         var s_fW_=x_fD_;
                        else
                         {var
                           _fX_=
                            extract_format_do_(fmt_eU_,i_eW_,i_e5_,widths_e__);
                          /*<<14883: printf.ml 83 2 42>>*/try
                           {var neg_fY_=0,i_fZ_=1;
                            for(;;)
                             {if(_fX_.getLen()<=i_fZ_)
                               var _f0_=[0,0,neg_fY_];
                              else
                               {var _f1_=_fX_.safeGet(i_fZ_);
                                if(49<=_f1_)
                                 if(58<=_f1_)
                                  var _f2_=0;
                                 else
                                  {var
                                    _f0_=
                                     [0,
                                      caml_int_of_string
                                       (_cl_(_fX_,i_fZ_,(_fX_.getLen()-i_fZ_|0)-1|0)),
                                      neg_fY_],
                                    _f2_=1;}
                                else
                                 {if(45===_f1_)
                                   {var _f4_=i_fZ_+1|0,_f3_=1,neg_fY_=_f3_,i_fZ_=_f4_;
                                    continue;}
                                  var _f2_=0;}
                                if(!_f2_){var _f5_=i_fZ_+1|0,i_fZ_=_f5_;continue;}}
                              var match_f6_=_f0_;
                              break;}}
                          catch(_f7_)
                           {if(_f7_[1]!==_a_)throw _f7_;
                            var match_f6_=bad_conversion_cZ_(_fX_,0,115);}
                          var
                           p_f8_=match_f6_[1],
                           _f9_=x_fD_.getLen(),
                           _f__=0,
                           neg_gc_=match_f6_[2],
                           _gb_=32;
                          if(p_f8_===_f9_&&0===_f__)
                           {var _f$_=x_fD_,_ga_=1;}
                          else
                           var _ga_=0;
                          if(!_ga_)
                           if(p_f8_<=_f9_)
                            var _f$_=_cl_(x_fD_,_f__,_f9_);
                           else
                            {var res_gd_=_ck_(p_f8_,_gb_);
                             if(neg_gc_)
                              /*<<14780: printf.ml 105 7 32>>*/_cm_
                               (x_fD_,_f__,res_gd_,0,_f9_);
                             else
                              /*<<14797: printf.ml 106 7 40>>*/_cm_
                               (x_fD_,_f__,res_gd_,p_f8_-_f9_|0,_f9_);
                             var _f$_=res_gd_;}
                          var s_fW_=_f$_;}
                        var
                         _fm_=
                          cont_s_fl_(next_index_e$_(spec_fd_,n_e8_),s_fW_,i_e5_+1|0),
                         _fh_=1;
                        break;
                       case 67:
                       case 99:
                        var x_ge_=get_arg_e7_(spec_fd_,n_e8_);
                        if(99===_fg_)
                         var s_gf_=_ck_(1,x_ge_);
                        else
                         {if(39===x_ge_)
                           var _gg_=_bJ_;
                          else
                           if(92===x_ge_)
                            var _gg_=_bK_;
                           else
                            {if(14<=x_ge_)
                              var _gh_=0;
                             else
                              switch(x_ge_)
                               {case 8:var _gg_=_bO_,_gh_=1;break;
                                case 9:var _gg_=_bN_,_gh_=1;break;
                                case 10:var _gg_=_bM_,_gh_=1;break;
                                case 13:var _gg_=_bL_,_gh_=1;break;
                                default:var _gh_=0;}
                             if(!_gh_)
                              if(caml_is_printable(x_ge_))
                               {var s_gi_=caml_create_string(1);
                                /*<<5422: char.ml 37 27 7>>*/s_gi_.safeSet(0,x_ge_);
                                var _gg_=s_gi_;}
                              else
                               {var s_gj_=caml_create_string(4);
                                /*<<5432: char.ml 41 13 7>>*/s_gj_.safeSet(0,92);
                                /*<<5432: char.ml 41 13 7>>*/s_gj_.safeSet
                                 (1,48+(x_ge_/100|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_gj_.safeSet
                                 (2,48+((x_ge_/10|0)%10|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_gj_.safeSet
                                 (3,48+(x_ge_%10|0)|0);
                                var _gg_=s_gj_;}}
                          var s_gf_=_b5_(_bz_,_b5_(_gg_,_bA_));}
                        var
                         _fm_=
                          cont_s_fl_(next_index_e$_(spec_fd_,n_e8_),s_gf_,i_e5_+1|0),
                         _fh_=1;
                        break;
                       case 66:
                       case 98:
                        var
                         _gl_=i_e5_+1|0,
                         _gk_=get_arg_e7_(spec_fd_,n_e8_)?_bR_:_bQ_,
                         _fm_=cont_s_fl_(next_index_e$_(spec_fd_,n_e8_),_gk_,_gl_),
                         _fh_=1;
                        break;
                       case 40:
                       case 123:
                        var
                         xf_gm_=get_arg_e7_(spec_fd_,n_e8_),
                         i_gn_=_dM_(sub_format_for_printf_ei_,_fg_,fmt_eU_,i_e5_+1|0);
                        if(123===_fg_)
                         {var
                           b_go_=_cG_(xf_gm_.getLen()),
                           add_char_gs_=
                            function(i_gq_,c_gp_){_cI_(b_go_,c_gp_);return i_gq_+1|0;};
                          /*<<13715: printf.ml 268 2 19>>*/iter_on_format_args_ey_
                           (xf_gm_,
                            function(skip_gr_,i_gu_,c_gt_)
                             {if(skip_gr_)
                               /*<<13680: printf.ml 272 17 41>>*/_cJ_(b_go_,_bt_);
                              else
                               /*<<13689: printf.ml 272 47 68>>*/_cI_(b_go_,37);
                              return add_char_gs_(i_gu_,c_gt_);},
                            add_char_gs_);
                          var
                           _gv_=_cH_(b_go_),
                           _fm_=cont_s_fl_(next_index_e$_(spec_fd_,n_e8_),_gv_,i_gn_),
                           _fh_=1;}
                        else
                         {var
                           _gw_=next_index_e$_(spec_fd_,n_e8_),
                           m_gz_=
                            add_int_index_cO_
                             (count_printing_arguments_of_format_gx_(xf_gm_),_gw_),
                           _fm_=
                            pr_gB_
                             (/*<<11831: printf.ml 647 30 39>>*/function(param_gA_)
                               {return doprn_gy_(m_gz_,i_gn_);},
                              _gw_,
                              xf_gm_,
                              v_e3_),
                           _fh_=1;}
                        break;
                       case 33:
                        _cP_(flush_gC_,out_eR_);
                        var _fm_=doprn_gy_(n_e8_,i_e5_+1|0),_fh_=1;
                        break;
                       case 41:
                        var _fm_=cont_s_fl_(n_e8_,_bF_,i_e5_+1|0),_fh_=1;break;
                       case 44:
                        var _fm_=cont_s_fl_(n_e8_,_bE_,i_e5_+1|0),_fh_=1;break;
                       case 70:
                        var x_gD_=get_arg_e7_(spec_fd_,n_e8_);
                        if(0===widths_e__)
                         var _gE_=_bD_;
                        else
                         {var
                           sfmt_gF_=
                            extract_format_do_(fmt_eU_,i_eW_,i_e5_,widths_e__);
                          if(70===_fg_)
                           /*<<14498: printf.ml 164 4 8>>*/sfmt_gF_.safeSet
                            (sfmt_gF_.getLen()-1|0,103);
                          var _gE_=sfmt_gF_;}
                        var _gG_=caml_classify_float(x_gD_);
                        if(3===_gG_)
                         var s_gH_=x_gD_<0?_bx_:_bw_;
                        else
                         if(4<=_gG_)
                          var s_gH_=_by_;
                         else
                          {var
                            _gI_=caml_format_float(_gE_,x_gD_),
                            i_gJ_=0,
                            l_gK_=_gI_.getLen();
                           /*<<13007: printf.ml 448 6 37>>*/for(;;)
                            {if(l_gK_<=i_gJ_)
                              var _gL_=_b5_(_gI_,_bv_);
                             else
                              {var
                                _gM_=_gI_.safeGet(i_gJ_)-46|0,
                                _gN_=
                                 _gM_<0||23<_gM_
                                  ?55===_gM_?1:0
                                  :(_gM_-1|0)<0||21<(_gM_-1|0)?1:0;
                               if(!_gN_){var _gO_=i_gJ_+1|0,i_gJ_=_gO_;continue;}
                               var _gL_=_gI_;}
                             var s_gH_=_gL_;
                             break;}}
                        var
                         _fm_=
                          cont_s_fl_(next_index_e$_(spec_fd_,n_e8_),s_gH_,i_e5_+1|0),
                         _fh_=1;
                        break;
                       case 91:
                        var
                         _fm_=bad_conversion_format_dS_(fmt_eU_,i_e5_,_fg_),
                         _fh_=1;
                        break;
                       case 97:
                        var
                         printer_gP_=get_arg_e7_(spec_fd_,n_e8_),
                         n_gQ_=_cP_(_cQ_,get_index_e0_(spec_fd_,n_e8_)),
                         arg_gR_=get_arg_e7_(0,n_gQ_),
                         _gV_=i_e5_+1|0,
                         _gU_=next_index_e$_(spec_fd_,n_gQ_);
                        if(to_s_gS_)
                         /*<<11772: printf.ml 631 8 63>>*/outs_gT_
                          (_ef_(printer_gP_,0,arg_gR_));
                        else
                         /*<<11781: printf.ml 633 8 23>>*/_ef_
                          (printer_gP_,out_eR_,arg_gR_);
                        var _fm_=doprn_gy_(_gU_,_gV_),_fh_=1;
                        break;
                       case 114:
                        var
                         _fm_=bad_conversion_format_dS_(fmt_eU_,i_e5_,_fg_),
                         _fh_=1;
                        break;
                       case 116:
                        var
                         printer_gW_=get_arg_e7_(spec_fd_,n_e8_),
                         _gY_=i_e5_+1|0,
                         _gX_=next_index_e$_(spec_fd_,n_e8_);
                        if(to_s_gS_)
                         /*<<11799: printf.ml 637 8 54>>*/outs_gT_
                          (_cP_(printer_gW_,0));
                        else
                         /*<<11807: printf.ml 639 8 19>>*/_cP_(printer_gW_,out_eR_);
                        var _fm_=doprn_gy_(_gX_,_gY_),_fh_=1;
                        break;
                       default:var _fh_=0;}
                    if(!_fh_)
                     var _fm_=bad_conversion_format_dS_(fmt_eU_,i_e5_,_fg_);
                    return _fm_;}},
               _g3_=i_eW_+1|0,
               _g0_=0;
              return scan_positional_spec_fe_
                      (fmt_eU_,
                       function(spec_g2_,i_gZ_)
                        {return scan_flags_fb_(spec_g2_,n_g1_,_g0_,i_gZ_);},
                       _g3_);}
            /*<<11906: printf.ml 614 15 25>>*/_ef_(outc_g4_,out_eR_,_eZ_);
            var _g5_=i_eW_+1|0,i_eW_=_g5_;
            continue;}}
        function cont_s_fl_(n_g8_,s_g6_,i_g7_)
         {outs_gT_(s_g6_);return doprn_gy_(n_g8_,i_g7_);}
        return doprn_gy_(n_g9_,0);}
      var
       kpr_g$_=_ef_(pr_gB_,k_g__,index_of_int_cN_(0)),
       _ha_=count_printing_arguments_of_format_gx_(fmt_eP_);
      if(_ha_<0||6<_ha_)
       {var
         loop_hn_=
          function(i_hb_,args_hh_)
           {if(_ha_<=i_hb_)
             {var
               a_hc_=caml_make_vect(_ha_,0),
               _hf_=
                function(i_hd_,arg_he_)
                 {return caml_array_set(a_hc_,(_ha_-i_hd_|0)-1|0,arg_he_);},
               i_hg_=0,
               param_hi_=args_hh_;
              for(;;)
               {if(param_hi_)
                 {var _hj_=param_hi_[2],_hk_=param_hi_[1];
                  if(_hj_)
                   {_hf_(i_hg_,_hk_);
                    var _hl_=i_hg_+1|0,i_hg_=_hl_,param_hi_=_hj_;
                    continue;}
                  /*<<13547: printf.ml 318 11 16>>*/_hf_(i_hg_,_hk_);}
                return _ef_(kpr_g$_,fmt_eP_,a_hc_);}}
            /*<<13383: printf.ml 363 31 56>>*/return function(x_hm_)
             {return loop_hn_(i_hb_+1|0,[0,x_hm_,args_hh_]);};},
         _ho_=loop_hn_(0,0);}
      else
       switch(_ha_)
        {case 1:
          var
           _ho_=
            /*<<13369: printf.ml 331 6 15>>*/function(x_hq_)
             {var a_hp_=caml_make_vect(1,0);
              /*<<13369: printf.ml 331 6 15>>*/caml_array_set(a_hp_,0,x_hq_);
              return _ef_(kpr_g$_,fmt_eP_,a_hp_);};
          break;
         case 2:
          var
           _ho_=
            function(x_hs_,y_ht_)
             {var a_hr_=caml_make_vect(2,0);
              caml_array_set(a_hr_,0,x_hs_);
              caml_array_set(a_hr_,1,y_ht_);
              return _ef_(kpr_g$_,fmt_eP_,a_hr_);};
          break;
         case 3:
          var
           _ho_=
            function(x_hv_,y_hw_,z_hx_)
             {var a_hu_=caml_make_vect(3,0);
              caml_array_set(a_hu_,0,x_hv_);
              caml_array_set(a_hu_,1,y_hw_);
              caml_array_set(a_hu_,2,z_hx_);
              return _ef_(kpr_g$_,fmt_eP_,a_hu_);};
          break;
         case 4:
          var
           _ho_=
            function(x_hz_,y_hA_,z_hB_,t_hC_)
             {var a_hy_=caml_make_vect(4,0);
              caml_array_set(a_hy_,0,x_hz_);
              caml_array_set(a_hy_,1,y_hA_);
              caml_array_set(a_hy_,2,z_hB_);
              caml_array_set(a_hy_,3,t_hC_);
              return _ef_(kpr_g$_,fmt_eP_,a_hy_);};
          break;
         case 5:
          var
           _ho_=
            function(x_hE_,y_hF_,z_hG_,t_hH_,u_hI_)
             {var a_hD_=caml_make_vect(5,0);
              caml_array_set(a_hD_,0,x_hE_);
              caml_array_set(a_hD_,1,y_hF_);
              caml_array_set(a_hD_,2,z_hG_);
              caml_array_set(a_hD_,3,t_hH_);
              caml_array_set(a_hD_,4,u_hI_);
              return _ef_(kpr_g$_,fmt_eP_,a_hD_);};
          break;
         case 6:
          var
           _ho_=
            function(x_hK_,y_hL_,z_hM_,t_hN_,u_hO_,v_hP_)
             {var a_hJ_=caml_make_vect(6,0);
              caml_array_set(a_hJ_,0,x_hK_);
              caml_array_set(a_hJ_,1,y_hL_);
              caml_array_set(a_hJ_,2,z_hM_);
              caml_array_set(a_hJ_,3,t_hN_);
              caml_array_set(a_hJ_,4,u_hO_);
              caml_array_set(a_hJ_,5,v_hP_);
              return _ef_(kpr_g$_,fmt_eP_,a_hJ_);};
          break;
         default:var _ho_=_ef_(kpr_g$_,fmt_eP_,[0]);}
      return _ho_;}
    /*<<11565: printf.ml 678 2 19>>*/function _hY_(fmt_hQ_)
     {return _cG_(2*fmt_hQ_.getLen()|0);}
    function _hV_(k_hT_,b_hR_)
     {var s_hS_=_cH_(b_hR_);
      /*<<11210: buffer.ml 56 14 29>>*/b_hR_[2]=0;
      return _cP_(k_hT_,s_hS_);}
    /*<<11524: printf.ml 691 2 78>>*/function _h3_(k_hU_)
     {var _hX_=_cP_(_hV_,k_hU_);
      return _h0_(_hZ_,1,_hY_,_cI_,_cJ_,function(_hW_){return 0;},_hX_);}
    /*<<11512: printf.ml 694 18 43>>*/function _h4_(fmt_h2_)
     {return _ef_
              (_h3_,
               /*<<11509: printf.ml 694 37 38>>*/function(s_h1_)
                {return s_h1_;},
               fmt_h2_);}
    var _h5_=[0,0];
    /*<<16823: random.ml 75 4 12>>*/function _h9_(s_h6_)
     {/*<<16823: random.ml 75 4 12>>*/s_h6_[2]=(s_h6_[2]+1|0)%55|0;
      var
       curval_h7_=caml_array_get(s_h6_[1],s_h6_[2]),
       newval30_h8_=
        (caml_array_get(s_h6_[1],(s_h6_[2]+24|0)%55|0)+
         (curval_h7_^curval_h7_>>>25&31)|
         0)&
        1073741823;
      /*<<16823: random.ml 75 4 12>>*/caml_array_set
       (s_h6_[1],s_h6_[2],newval30_h8_);
      return newval30_h8_;}
    32===_cn_;
    var _h__=[0,_bj_.slice(),0];
    /*<<16525: random.ml 165 16 39>>*/function _ie_(bound_h$_)
     {if(1073741823<bound_h$_||!(0<bound_h$_))
       var _ia_=0;
      else
       for(;;)
        {var r_ib_=_h9_(_h__),v_ic_=caml_mod(r_ib_,bound_h$_);
         if(((1073741823-bound_h$_|0)+1|0)<(r_ib_-v_ic_|0))continue;
         var _id_=v_ic_,_ia_=1;
         break;}
      if(!_ia_)var _id_=_bU_(_bk_);
      return _id_;}
    var seq_if_=[];
    /*<<17834: src/core/lwt_sequence.ml 63 2 5>>*/caml_update_dummy
     (seq_if_,[0,seq_if_,seq_if_]);
    var null_ig_=null,undefined_ih_=undefined;
    function _il_(x_ii_,f_ij_,g_ik_)
     {return x_ii_===undefined_ih_?_cP_(f_ij_,0):_cP_(g_ik_,x_ii_);}
    var regExp_im_=RegExp,array_constructor_in_=Array;
    function array_get_ir_(_io_,_ip_){return _io_[_ip_];}
    /*<<24755: js.ml 376 7 77>>*/function _is_(e_iq_)
     {return e_iq_ instanceof array_constructor_in_
              ?0
              :[0,new MlWrappedString(e_iq_.toString())];}
    /*<<15420: printexc.ml 167 2 29>>*/_h5_[1]=[0,_is_,_h5_[1]];
    function _iu_(_it_){return _it_;}
    _iu_(this.HTMLElement)===undefined_ih_;
    /*<<34280: regexp.ml 25 15 73>>*/function regexp_iw_(s_iv_)
     {return new regExp_im_(caml_js_from_byte_string(s_iv_),_bh_.toString());}
    new regExp_im_(_bf_.toString(),_bg_.toString());
    var _iA_=regexp_iw_(_be_);
    function split_iz_(c_ix_,s_iy_)
     {return s_iy_.split(_ck_(1,c_ix_).toString());}
    var Local_exn_iB_=[0,_ba_];
    /*<<35836: url.ml 27 19 34>>*/function interrupt_iD_(param_iC_)
     {throw [0,Local_exn_iB_];}
    regexp_iw_
     (caml_js_to_byte_string
       (caml_js_from_byte_string(_a$_).replace(_iA_,_bi_.toString())));
    var plus_re_js_string_iE_=new regExp_im_(_a9_.toString(),_a__.toString());
    /*<<35761: url.ml 44 2 60>>*/function urldecode_js_string_string_iR_
     (s_iF_)
     {/*<<35784: url.ml 39 2 3>>*/plus_re_js_string_iE_.lastIndex=0;
      return caml_js_to_byte_string
              (unescape(s_iF_.replace(plus_re_js_string_iE_,_bb_.toString())));}
    /*<<34417: url.ml 97 2 23>>*/function path_of_path_string_iM_(s_iG_)
     {/*<<34417: url.ml 97 2 23>>*/try
       {var length_iH_=s_iG_.getLen();
        if(0===length_iH_)
         var _iI_=_bd_;
        else
         {var i_iJ_=0,_iL_=47,_iK_=s_iG_.getLen();
          for(;;)
           {if(_iK_<=i_iJ_)throw [0,_c_];
            if(s_iG_.safeGet(i_iJ_)!==_iL_)
             {var _iP_=i_iJ_+1|0,i_iJ_=_iP_;continue;}
            if(0===i_iJ_)
             var
              _iN_=
               [0,_bc_,path_of_path_string_iM_(_cl_(s_iG_,1,length_iH_-1|0))];
            else
             {var
               _iO_=
                path_of_path_string_iM_
                 (_cl_(s_iG_,i_iJ_+1|0,(length_iH_-i_iJ_|0)-1|0)),
               _iN_=[0,_cl_(s_iG_,0,i_iJ_),_iO_];}
            var _iI_=_iN_;
            break;}}}
      catch(_iQ_){if(_iQ_[1]===_c_)return [0,s_iG_,0];throw _iQ_;}
      return _iI_;}
    new regExp_im_(caml_js_from_byte_string(_a8_));
    new regExp_im_(caml_js_from_byte_string(_a7_));
    var l_iS_=location;
    urldecode_js_string_string_iR_(l_iS_.hostname);
    try {}catch(_iT_){if(_iT_[1]!==_a_)throw _iT_;}
    path_of_path_string_iM_(urldecode_js_string_string_iR_(l_iS_.pathname));
    var arr_iU_=split_iz_(38,l_iS_.search),len_je_=arr_iU_.length;
    function aux_ja_(acc_i$_,idx_iV_)
     {var idx_iW_=idx_iV_;
      for(;;)
       {if(0<=idx_iW_)
         {/*<<35441: url.ml 132 9 45>>*/try
           {var
             _i9_=idx_iW_-1|0,
             _i__=
              /*<<35415: url.ml 135 30 33>>*/function(s_i4_)
               {/*<<35396: url.ml 137 37 48>>*/function _i6_(param_iX_)
                 {var y_i2_=param_iX_[2],x_i1_=param_iX_[1];
                  /*<<35385: url.ml 139 36 65>>*/function get_i0_(t_iY_)
                   {var _iZ_=t_iY_===undefined_ih_?interrupt_iD_(0):t_iY_;
                    return urldecode_js_string_string_iR_(_iZ_);}
                  var _i3_=get_i0_(y_i2_);
                  return [0,get_i0_(x_i1_),_i3_];}
                var arr_bis_i5_=split_iz_(61,s_i4_);
                if(2===arr_bis_i5_.length)
                 {var
                   _i7_=array_get_ir_(arr_bis_i5_,1),
                   _i8_=_iu_([0,array_get_ir_(arr_bis_i5_,0),_i7_]);}
                else
                 var _i8_=undefined_ih_;
                return _il_(_i8_,interrupt_iD_,_i6_);},
             _jb_=
              aux_ja_
               ([0,
                 _il_(array_get_ir_(arr_iU_,idx_iW_),interrupt_iD_,_i__),
                 acc_i$_],
                _i9_);}
          catch(_jc_)
           {if(_jc_[1]===Local_exn_iB_)
             {var _jd_=idx_iW_-1|0,idx_iW_=_jd_;continue;}
            throw _jc_;}
          return _jb_;}
        return acc_i$_;}}
    /*<<35548: url.ml 121 2 16>>*/aux_ja_(0,len_je_-1|0);
    urldecode_js_string_string_iR_(l_iS_.href);
    function _jj_(f_jg_,param_jf_)
     {var x_jh_=param_jf_[1],_ji_=_cP_(f_jg_,param_jf_[2]);
      return [0,_cP_(f_jg_,x_jh_),_ji_];}
    /*<<40727: src/option.ml 23 16 15>>*/function _jl_(param_jk_)
     {return param_jk_?param_jk_[1]:_j_(_a6_);}
    function _jB_(arr_jm_,f_jp_)
     {var l_jn_=arr_jm_.length-1;
      if(0===l_jn_)
       var _jo_=[0];
      else
       {var
         r_jq_=caml_make_vect(l_jn_,_cP_(f_jp_,arr_jm_[0+1])),
         _jr_=1,
         _js_=l_jn_-1|0;
        if(!(_js_<_jr_))
         {var i_jt_=_jr_;
          for(;;)
           {r_jq_[i_jt_+1]=_cP_(f_jp_,arr_jm_[i_jt_+1]);
            var _ju_=i_jt_+1|0;
            if(_js_!==i_jt_){var i_jt_=_ju_;continue;}
            break;}}
        var _jo_=r_jq_;}
      return _jo_;}
    function _jC_(arr_jw_,f_jz_)
     {var _jv_=0,_jx_=arr_jw_.length-1-1|0;
      if(!(_jx_<_jv_))
       {var i_jy_=_jv_;
        for(;;)
         {_cP_(f_jz_,arr_jw_[i_jy_+1]);
          var _jA_=i_jy_+1|0;
          if(_jx_!==i_jy_){var i_jy_=_jA_;continue;}
          break;}}
      return 0;}
    ({}.iter=caml_js_eval_string(_a5_));
    function _jG_(_opt__jD_,ts_jF_)
     {var sep_jE_=_opt__jD_?_opt__jD_[1]:_a4_;
      return new
              MlWrappedString
              (caml_js_from_array(ts_jF_).join(sep_jE_.toString()));}
    var
     _jH_=caml_js_eval_string(_a2_),
     _jQ_={"iter":caml_js_eval_string(_a1_),"fold":_jH_};
    /*<<43483: src/inttbl.ml 19 16 34>>*/function _j1_(param_jI_){return {};}
    function _j2_(t_jJ_,key_jK_,data_jL_){return t_jJ_[key_jK_]=data_jL_;}
    function _j3_(t_jM_,k_jN_){return delete t_jM_[k_jN_];}
    function _j4_(t_jO_,k_jP_)
     {return t_jO_.hasOwnProperty(k_jP_)|0?[0,t_jO_[k_jP_]]:0;}
    function _jZ_(t_jV_,f_jT_)
     {var js_iter_jU_=_jQ_[_a3_.toString()];
      return js_iter_jU_
              (t_jV_,
               caml_js_wrap_callback
                (function(key_jS_,data_jR_)
                  {return _ef_(f_jT_,key_jS_,data_jR_);}));}
    /*<<43065: src/inttbl.ml 83 2 6>>*/function _j5_(t_j0_)
     {var len_jW_=[0,0];
      /*<<43065: src/inttbl.ml 83 2 6>>*/_jZ_
       (t_j0_,function(param_jX_,_jY_){len_jW_[1]+=1;return 0;});
      return len_jW_[1];}
    /*<<43919: src/core.ml 17 24 73>>*/function string_of_float_j7_(x_j6_)
     {return new MlWrappedString(x_j6_.toString());}
    caml_js_eval_string(_a0_);
    function _j__(x_j8_,f_j9_){return _cP_(f_j9_,x_j8_);}
    /*<<46731: src/frp.ml 18 24 26>>*/function _mj_(param_j$_){return 0;}
    /*<<46727: src/frp.ml 20 17 21>>*/function _kb_(t_ka_)
     {return _cP_(t_ka_,0);}
    function _mk_(t1_kc_,t2_kd_,param_ke_){_kb_(t1_kc_);return _kb_(t2_kd_);}
    function _ml_(ts_kf_,param_kg_){return _jC_(ts_kf_,_kb_);}
    /*<<46702: src/frp.ml 26 15 16>>*/function _lH_(x_kh_){return x_kh_;}
    function notify_km_(listeners_kl_,x_ki_)
     {return _jZ_
              (listeners_kl_,
               function(param_kk_,data_kj_){return _cP_(data_kj_,x_ki_);});}
    function notify_all_kA_(ls_kp_,x_kn_)
     {return _jC_
              (ls_kp_,
               /*<<46659: src/frp.ml 33 51 61>>*/function(l_ko_)
                {return notify_km_(l_ko_,x_kn_);});}
    function _ll_(tbl_kt_,t_kq_,f_ks_)
     {var key_kr_=t_kq_[6];
      t_kq_[6]=t_kq_[6]+1|0;
      _j2_(tbl_kt_,key_kr_,f_ks_);
      return key_kr_;}
    function create_mm_(start_ku_,param_kI_)
     {var
       start_kv_=start_ku_?start_ku_[1]:function(param_kw_,_kx_){return 0;},
       on_listeners_ky_=_j1_(0),
       passive_listeners_kz_=_j1_(0);
      /*<<46582: src/frp.ml 52 8 58>>*/function trigger_kC_(x_kB_)
       {return notify_all_kA_
                ([0,on_listeners_ky_,passive_listeners_kz_],x_kB_);}
      var _kG_=0,_kF_=_j1_(0);
      /*<<46579: src/frp.ml 57 39 41>>*/function _kH_(param_kD_){return 0;}
      return [0,
              [0,
               /*<<46575: src/frp.ml 56 27 40>>*/function(param_kE_)
                {return _cP_(start_kv_,trigger_kC_);},
               _kH_,
               on_listeners_ky_,
               _kF_,
               passive_listeners_kz_,
               _kG_]];}
    function turn_on_kW_(key_kM_,t_kJ_)
     {{if(0===t_kJ_[0])
        {var
          p_kK_=t_kJ_[1],
          go_kO_=
           function(tbl_kN_,f_kL_)
            {_j2_(p_kK_[3],key_kM_,f_kL_);
             _j3_(tbl_kN_,key_kM_);
             return 1===_j5_(p_kK_[3])?(p_kK_[2]=_cP_(p_kK_[1],0),0):0;},
          _kP_=_j4_(p_kK_[4],key_kM_);
         if(_kP_)
          var _kQ_=go_kO_(p_kK_[4],_kP_[1]);
         else
          {var
            _kR_=_j4_(p_kK_[5],key_kM_),
            _kQ_=_kR_?go_kO_(p_kK_[5],_kR_[1]):_j_(_aW_);}
         return _kQ_;}
       var
        d_kS_=t_kJ_[1],
        go_kY_=
         function(tbl_kU_,f_kT_)
          {_j2_(d_kS_[2],key_kM_,f_kT_);
           _j3_(tbl_kU_,key_kM_);
           if(1===_j5_(d_kS_[2]))
            {var
              _kX_=
               /*<<44732: src/frp.ml 181 40 64>>*/function(param_kV_)
                {return turn_on_kW_(param_kV_[1],param_kV_[2][1]);};
             return _jC_(d_kS_[5],_kX_);}
           return 0;},
        _kZ_=_j4_(d_kS_[3],key_kM_);
       if(_kZ_)
        var _k0_=go_kY_(d_kS_[3],_kZ_[1]);
       else
        {var
          _k1_=_j4_(d_kS_[4],key_kM_),
          _k0_=_k1_?go_kY_(d_kS_[4],_k1_[1]):_j_(_aZ_);}
       return _k0_;}}
    function turn_off_lc_(key_k5_,t_k2_)
     {{if(0===t_k2_[0])
        {var
          p_k3_=t_k2_[1],
          go_k7_=
           function(tbl_k6_,f_k4_)
            {_j2_(p_k3_[4],key_k5_,f_k4_);return _j3_(tbl_k6_,key_k5_);},
          _k8_=_j4_(p_k3_[3],key_k5_);
         if(_k8_)
          {go_k7_(p_k3_[3],_k8_[1]);
           var _k9_=0===_j5_(p_k3_[3])?_cP_(p_k3_[2],0):0;}
         else
          {var
            _k__=_j4_(p_k3_[5],key_k5_),
            _k9_=_k__?go_k7_(p_k3_[5],_k__[1]):_j_(_aX_);}
         return _k9_;}
       var d_k$_=t_k2_[1],_la_=_j4_(d_k$_[2],key_k5_);
       if(_la_)
        {_j2_(d_k$_[3],key_k5_,_la_[1]);
         _j3_(d_k$_[2],key_k5_);
         if(0===_j5_(d_k$_[2]))
          {var
            _ld_=
             /*<<44869: src/frp.ml 203 42 67>>*/function(param_lb_)
              {return turn_off_lc_(param_lb_[1],param_lb_[2][1]);},
            _le_=_jC_(d_k$_[5],_ld_);}
         else
          var _le_=0;}
       else
        var _le_=_j_(_aY_);
       return _le_;}}
    function add_listener__lo_(tbl_li_,t_lf_,f_lh_)
     {var key_lg_=t_lf_[1];
      t_lf_[1]=t_lf_[1]+1|0;
      _j2_(tbl_li_,key_lg_,f_lh_);
      return key_lg_;}
    function add_off_listener_lv_(t_lj_,f_lm_)
     {{if(0===t_lj_[0]){var p_lk_=t_lj_[1];return _ll_(p_lk_[4],p_lk_,f_lm_);}
       var d_ln_=t_lj_[1];
       return add_listener__lo_(d_ln_[3],d_ln_,f_lm_);}}
    function create_with_lB_(parent_lw_,update_lu_)
     {var on_listeners_lp_=_j1_(0),passive_listeners_lq_=_j1_(0);
      /*<<45926: src/frp.ml 244 6 32>>*/function trigger_lt_(x_lr_)
       {/*<<45926: src/frp.ml 244 6 32>>*/notify_km_(on_listeners_lp_,x_lr_);
        return notify_km_(passive_listeners_lq_,x_lr_);}
      var
       _lx_=
        [0,
         [0,
          add_off_listener_lv_
           (parent_lw_,
            /*<<45921: src/frp.ml 247 48 64>>*/function(x_ls_)
             {return _ef_(update_lu_,trigger_lt_,x_ls_);}),
          [0,parent_lw_]]];
      return [1,[0,0,on_listeners_lp_,_j1_(0),passive_listeners_lq_,_lx_]];}
    function map_lU_(t_lC_,f_lz_)
     {return create_with_lB_
              (t_lC_,
               function(trigger_lA_,x_ly_)
                {return _cP_(trigger_lA_,_cP_(f_lz_,x_ly_));});}
    function iter_mn_(t_lE_,f_lD_)
     {var key_lF_=add_off_listener_lv_(t_lE_,f_lD_);
      turn_on_kW_(key_lF_,t_lE_);
      return _lH_
              (/*<<45878: src/frp.ml 264 33 47>>*/function(param_lG_)
                {return turn_off_lc_(key_lF_,t_lE_);});}
    /*<<44672: src/frp.ml 449 15 25>>*/function peek_mo_(t_lI_)
     {return t_lI_[2][1];}
    /*<<44659: src/frp.ml 451 20 75>>*/function return_mp_(init_lJ_)
     {var _lK_=_j1_(0),_lL_=_j1_(0);
      return [0,[1,[0,0,_j1_(0),_lL_,_lK_,[0]]],[0,init_lJ_],0];}
    function create_lY_(value_lM_,s_lP_)
     {/*<<44633: src/frp.ml 454 52 62>>*/function _lO_(x_lN_)
       {/*<<44633: src/frp.ml 454 52 62>>*/value_lM_[1]=x_lN_;return 0;}
      if(0===s_lP_[0])
       {var p_lQ_=s_lP_[1],k_lR_=_ll_(p_lQ_[5],p_lQ_,_lO_);}
      else
       {var d_lS_=s_lP_[1],k_lR_=add_listener__lo_(d_lS_[4],d_lS_,_lO_);}
      return [0,s_lP_,value_lM_,[0,k_lR_]];}
    function map_mq_(param_lT_,f_lV_)
     {var value_lW_=param_lT_[2],s__lX_=map_lU_(param_lT_[1],f_lV_);
      return create_lY_([0,_cP_(f_lV_,value_lW_[1])],s__lX_);}
    function zip_with_mr_(t1_l4_,t2_l1_,f_l3_)
     {var on_listeners_lZ_=_j1_(0),passive_listeners_l0_=_j1_(0);
      /*<<44482: src/frp.ml 470 8 27>>*/function _l5_(x_l2_)
       {return notify_all_kA_
                ([0,on_listeners_lZ_,passive_listeners_l0_],
                 _ef_(f_l3_,x_l2_,t2_l1_[2][1]));}
      var key1_l7_=add_off_listener_lv_(t1_l4_[1],_l5_);
      /*<<44464: src/frp.ml 473 8 27>>*/function _l8_(y_l6_)
       {return notify_all_kA_
                ([0,on_listeners_lZ_,passive_listeners_l0_],
                 _ef_(f_l3_,t1_l4_[2][1],y_l6_));}
      var
       key2_l9_=add_off_listener_lv_(t2_l1_[1],_l8_),
       _l__=[0,[0,key1_l7_,[0,t1_l4_[1]]],[0,key2_l9_,[0,t2_l1_[1]]]],
       s_l$_=[1,[0,0,on_listeners_lZ_,_j1_(0),passive_listeners_l0_,_l__]];
      return create_lY_([0,_ef_(f_l3_,t1_l4_[2][1],t2_l1_[2][1])],s_l$_);}
    /*<<44261: src/frp.ml 521 14 24>>*/function _ms_(param_ma_)
     {return param_ma_[1];}
    function _mt_(s_mi_,init_mb_,f_me_)
     {var last_mc_=[0,init_mb_],value_mh_=[0,init_mb_];
      return create_lY_
              (value_mh_,
               create_with_lB_
                (s_mi_,
                 function(trigger_mg_,x_md_)
                  {var y_mf_=_ef_(f_me_,last_mc_[1],x_md_);
                   last_mc_[1]=y_mf_;
                   return _cP_(trigger_mg_,y_mf_);}));}
    /*<<48663: src/jq.ml 5 29 84>>*/function unsafe_jq_mV_(s_mu_)
     {return jQuery(s_mu_.toString());}
    /*<<48617: src/jq.ml 14 13 58>>*/function wrap_mE_(elt_mv_)
     {return jQuery(elt_mv_);}
    function stop_on_removal_mG_(t_mz_,sub_mw_)
     {var
       _my_=
        caml_js_wrap_callback
         (/*<<48387: src/jq.ml 56 27 54>>*/function(param_mx_)
           {return _kb_(sub_mw_);});
      t_mz_.on(_aO_.toString(),_my_);
      return sub_mw_;}
    function _mW_(t_mD_,name_mB_,value_mA_)
     {var _mC_=peek_mo_(value_mA_).toString();
      t_mD_.setAttribute(name_mB_.toString(),_mC_);
      var
       name_mF_=name_mB_.toString(),
       _mI_=_cP_(stop_on_removal_mG_,wrap_mE_(t_mD_));
      /*<<48211: src/jq.ml 83 6 7>>*/function _mJ_(value_mH_)
       {return t_mD_.setAttribute(name_mF_,value_mH_.toString());}
      return _j__(iter_mn_(_ms_(value_mA_),_mJ_),_mI_);}
    function _mX_(t_mL_,s_mK_){return t_mL_.innerHTML=s_mK_.toString();}
    function _mY_(t_mM_,c_mN_){t_mM_.appendChild(c_mN_);return 0;}
    function _mZ_(tag_mQ_,attrs_mU_)
     {/*<<48005: src/jq.ml 101 16 46>>*/function str_mP_(s_mO_)
       {return s_mO_.toString();}
      var
       _mR_=str_mP_(tag_mQ_),
       elt_mS_=document.createElementNS(str_mP_(_aP_),_mR_);
      _jC_
       (attrs_mU_,
        /*<<47979: src/jq.ml 107 29 49>>*/function(param_mT_)
         {return elt_mS_.setAttribute
                  (param_mT_[1].toString(),param_mT_[2].toString());});
      return elt_mS_;}
    var body_m0_=unsafe_jq_mV_(_aL_);
    function setup_event_handlers_m8_(t_m5_,hs_m2_)
     {var
       hs__m3_=
        _jB_
         (hs_m2_,
          /*<<47881: src/jq.ml 156 33 42>>*/function(param_m1_)
           {return [0,param_m1_[1],caml_js_wrap_callback(param_m1_[2])];});
      _jC_
       (hs__m3_,
        /*<<47871: src/jq.ml 159 25 43>>*/function(param_m4_)
         {return t_m5_.on(param_m4_[1].toString(),param_m4_[2]);});
      /*<<47858: src/jq.ml 161 12 45>>*/return function(param_m7_)
       {return _jC_
                (hs__m3_,
                 /*<<47848: src/jq.ml 161 35 44>>*/function(param_m6_)
                  {return t_m5_.off(param_m6_[1].toString(),param_m6_[2]);});};}
    var
     _nd_=0,
     key_stream_nf_=
      create_mm_
       ([0,
         /*<<47821: src/jq.ml 166 4 6>>*/function(trigger_na_)
          {/*<<47812: src/jq.ml 166 34 59>>*/function which_m$_(e_m9_)
            {return e_m9_[_aS_.toString()];}
           var
            _nc_=
             [0,
              _aR_,
              /*<<47788: src/jq.ml 169 27 71>>*/function(e_m__)
               {/*<<47788: src/jq.ml 169 27 71>>*/e_m__.preventDefault();
                return _cP_(trigger_na_,[0,19067,which_m$_(e_m__)]);}];
           return setup_event_handlers_m8_
                   (body_m0_,
                    [0,
                     [0,
                      _aQ_,
                      /*<<47758: src/jq.ml 168 27 73>>*/function(e_nb_)
                       {/*<<47758: src/jq.ml 168 27 73>>*/e_nb_.preventDefault();
                        return _cP_(trigger_na_,[0,759637122,which_m$_(e_nb_)]);}],
                     _nc_]);}],
        _nd_),
     pressed_ne_=_j1_(0);
    _mt_
     (key_stream_nf_,
      [0],
      function(param_nk_,k_ng_)
       {if(759637122<=k_ng_[1])
         _j2_(pressed_ne_,k_ng_[2],0);
        else
         _j3_(pressed_ne_,k_ng_[2]);
        var arr_nh_=new array_constructor_in_();
        /*<<43165: src/inttbl.ml 68 2 17>>*/_jZ_
         (pressed_ne_,
          function(key_ni_,data_nj_){return arr_nh_.push(key_ni_);});
        return caml_js_to_array(arr_nh_);});
    var
     _nn_=0,
     mouse_pos_no_=
      create_mm_
       ([0,
         /*<<47692: src/jq.ml 184 4 54>>*/function(trigger_nm_)
          {return setup_event_handlers_m8_
                   (body_m0_,
                    [0,
                     [0,
                      _aT_,
                      /*<<47673: src/jq.ml 185 6 78>>*/function(e_nl_)
                       {return _cP_
                                (trigger_nm_,
                                 [0,e_nl_[_aU_.toString()],e_nl_[_aV_.toString()]]);}]]);}],
        _nn_),
     last_np_=[0,0];
    create_with_lB_
     (mouse_pos_no_,
      function(trigger_nt_,x_ns_)
       {var _nq_=last_np_[1];
        if(_nq_)
         {var x_nr_=_nq_[1];
          _cP_(trigger_nt_,[0,x_ns_[1]-x_nr_[1]|0,x_ns_[2]-x_nr_[2]|0]);}
        last_np_[1]=[0,x_ns_];
        return 0;});
    /*<<51746: src/draw.ml 8 13 65>>*/function _nx_(param_nu_)
     {var x_nv_=param_nu_[1],_nw_=_b5_(_t_,string_of_float_j7_(param_nu_[2]));
      return _b5_(string_of_float_j7_(x_nv_),_nw_);}
    /*<<51729: src/draw.ml 10 24 78>>*/function _nC_(pts_ny_)
     {return _jG_(_u_,_jB_(pts_ny_,_nx_));}
    /*<<51660: src/draw.ml 21 13 50>>*/function _nB_(param_nz_)
     {return _nA_
              (_h4_,_v_,param_nz_[1],param_nz_[2],param_nz_[3],param_nz_[4]);}
    var _oy_=[0,_f_[1],_f_[2],_f_[3],0],c_nD_=2*(4*Math.atan(1))/360;
    /*<<51651: src/draw.ml 38 58 64>>*/function to_radians_od_(x_nE_)
     {return c_nD_*x_nE_;}
    /*<<51323: src/draw.ml 85 15 56>>*/function _nJ_(param_nF_)
     {switch(param_nF_[0])
       {case 1:return _dM_(_h4_,_A_,param_nF_[1],param_nF_[2]);
        case 2:return _dM_(_h4_,_z_,param_nF_[1],param_nF_[2]);
        case 3:
         var match_nG_=param_nF_[2];
         return _nH_(_h4_,_y_,param_nF_[1],match_nG_[1],match_nG_[2]);
        case 4:return _ef_(_h4_,_x_,param_nF_[1]);
        case 5:return _ef_(_h4_,_w_,param_nF_[1]);
        default:
         return _nI_
                 (_h4_,
                  _B_,
                  param_nF_[1],
                  param_nF_[2],
                  param_nF_[3],
                  param_nF_[4],
                  param_nF_[5],
                  param_nF_[6]);}}
    /*<<51306: src/draw.ml 95 4 57>>*/function _oA_(ts_nK_)
     {return _jG_(_C_,_jB_(ts_nK_,_nJ_));}
    function _oz_(_opt__nL_,_nN_,color_nP_,width_nQ_)
     {var
       cap_nM_=_opt__nL_?_opt__nL_[1]:737755699,
       join_nO_=_nN_?_nN_[1]:463106021;
      return [1,[0,cap_nM_,join_nO_,width_nQ_,color_nP_]];}
    /*<<51089: src/draw.ml 149 4 60>>*/function _ot_(param_nR_)
     {switch(param_nR_[0])
       {case 1:
         var
          match_nS_=param_nR_[1],
          join_nT_=match_nS_[2],
          cap_nU_=match_nS_[1],
          color_nX_=match_nS_[4],
          width_nW_=match_nS_[3],
          _nV_=9660462===join_nT_?_G_:463106021<=join_nT_?_I_:_H_,
          _nZ_=_b5_(_Q_,_nV_),
          _nY_=226915517===cap_nU_?_D_:737755699<=cap_nU_?_F_:_E_,
          _n0_=_b5_(_P_,_nY_),
          _n1_=_b5_(_O_,string_of_int_b6_(width_nW_));
         return _jG_(_M_,[0,_b5_(_N_,_nB_(color_nX_)),_n1_,_n0_,_nZ_]);
        case 2:
         return _b5_(_K_,_jG_(_L_,_jB_(param_nR_[1],string_of_float_j7_)));
        case 3:return _dM_(_h4_,_J_,param_nR_[1],param_nR_[2]);
        default:return _b5_(_R_,_nB_(param_nR_[1]));}}
    /*<<51045: src/draw.ml 180 27 60>>*/function _n$_(param_n2_)
     {return -64519044<=param_n2_?0:1;}
    /*<<50905: src/draw.ml 184 15 57>>*/function _oC_(param_n3_)
     {switch(param_n3_[0])
       {case 1:
         var match_n4_=param_n3_[1];
         return _dM_(_h4_,_U_,match_n4_[1],match_n4_[2]);
        case 2:
         var
          r_n5_=param_n3_[4],
          match_n6_=param_n3_[1],
          l_n__=param_n3_[2],
          y_n9_=match_n6_[2],
          x_n8_=match_n6_[1],
          _n7_=5594516<=param_n3_[3]?0:1;
         return _nI_(_h4_,_T_,r_n5_,r_n5_,_n$_(l_n__),_n7_,x_n8_,y_n9_);
        case 3:
         var
          r_oa_=param_n3_[4],
          a1_ob_=param_n3_[1],
          a2_oc_=param_n3_[2],
          flag_oe_=_n$_(param_n3_[3]),
          _of_=Math.sin(to_radians_od_(a1_ob_))*r_oa_,
          _og_=-Math.cos(to_radians_od_(a1_ob_))*r_oa_,
          y_oj_=_d_[2],
          x_oi_=_d_[1],
          angle_oh_=to_radians_od_(a2_oc_-a1_ob_),
          _ok_=y_oj_-_of_,
          _ol_=x_oi_-_og_;
         return _h0_
                 (_h4_,
                  _S_,
                  r_oa_,
                  r_oa_,
                  flag_oe_,
                  _ol_*Math.cos(angle_oh_)-_ok_*Math.sin(angle_oh_)+_og_,
                  _ol_*Math.sin(angle_oh_)+_ok_*Math.cos(angle_oh_)+_of_);
        default:
         var match_om_=param_n3_[1];
         return _dM_(_h4_,_V_,match_om_[1],match_om_[2]);}}
    function path_oB_(name_op_,_opt__on_,mask_or_,anchor_os_,segs_oq_)
     {var props_oo_=_opt__on_?_opt__on_[1]:[0];
      return [3,[0,name_op_],props_oo_,anchor_os_,mask_or_,segs_oq_];}
    /*<<50546: src/draw.ml 303 27 89>>*/function render_properties_oD_(ps_ou_)
     {return _jG_(_X_,_jB_(ps_ou_,_ot_));}
    function sink_attrs_oE_(elt_ow_,ps_ox_)
     {return _j__
              (_jB_
                (ps_ox_,
                 /*<<50510: src/draw.ml 306 20 70>>*/function(param_ov_)
                  {return _mW_(elt_ow_,param_ov_[1],param_ov_[2]);}),
               _ml_);}
    var render_oF_=[];
    /*<<50179: src/draw.ml 333 39 66>>*/function _oH_(param_oG_)
     {return string_of_float_j7_(param_oG_[1]);}
    function x_beh_p6_(_oI_){return map_mq_(_oI_,_oH_);}
    /*<<50166: src/draw.ml 334 39 66>>*/function _oK_(param_oJ_)
     {return string_of_float_j7_(param_oJ_[2]);}
    function y_beh_p4_(_oL_){return map_mq_(_oL_,_oK_);}
    /*<<50153: src/draw.ml 335 23 70>>*/function zip_props_pi_(ps_b_oO_)
     {var
       on_listeners_oM_=_j1_(0),
       passive_listeners_oN_=_j1_(0),
       parents_oT_=
        _jB_
         (ps_b_oO_,
          /*<<44373: src/frp.ml 493 10 33>>*/function(t_oQ_)
           {/*<<44350: src/frp.ml 494 12 40>>*/function _oR_(x_oP_)
             {return notify_all_kA_
                      ([0,on_listeners_oM_,passive_listeners_oN_],
                       render_properties_oD_(_jB_(ps_b_oO_,peek_mo_)));}
            var key_oS_=add_off_listener_lv_(t_oQ_[1],_oR_);
            return [0,key_oS_,[0,t_oQ_[1]]];}),
       s_oU_=
        [1,[0,0,on_listeners_oM_,_j1_(0),passive_listeners_oN_,parents_oT_]];
      return create_lY_
              ([0,render_properties_oD_(_jB_(ps_b_oO_,peek_mo_))],s_oU_);}
    function path_mask_pH_(elt_oV_,segs_o5_,mask_o7_,props_pc_)
     {/*<<50055: src/draw.ml 338 32 77>>*/function get_length_oX_(param_oW_)
       {return elt_oV_.getTotalLength();}
      var _o1_=get_length_oX_(0);
      function _o0_(param_oZ_,x_oY_){return x_oY_;}
      function _o4_(_o2_){return _mt_(_o2_,_o1_,_o0_);}
      /*<<50039: src/draw.ml 340 62 75>>*/function _o6_(param_o3_)
       {return get_length_oX_(0);}
      var path_length_pa_=_j__(map_lU_(_ms_(segs_o5_),_o6_),_o4_);
      if(mask_o7_)
       {var
         mask_o$_=mask_o7_[1],
         _pb_=
          [0,
           zip_with_mr_
            (path_length_pa_,
             mask_o$_,
             function(l_o__,param_o8_)
              {var a_o9_=param_o8_[1];
               return [2,[254,0,l_o__*a_o9_,l_o__*(param_o8_[2]-a_o9_),l_o__]];})],
         l1_pd_=props_pc_.length-1;
        if(0===l1_pd_)
         {var
           l_pe_=_pb_.length-1,
           _pf_=0===l_pe_?[0]:caml_array_sub(_pb_,0,l_pe_),
           _pg_=_pf_;}
        else
         var
          _pg_=
           0===_pb_.length-1
            ?caml_array_sub(props_pc_,0,l1_pd_)
            :caml_array_append(props_pc_,_pb_);
        var props__ph_=_pg_;}
      else
       var props__ph_=props_pc_;
      return _mW_(elt_oV_,_Y_,zip_props_pi_(props__ph_));}
    function mk_name_sub_pz_(name_opt_pj_,elt_pk_)
     {if(name_opt_pj_)
       {var
         x_pl_=name_opt_pj_[1],
         _pm_=wrap_mE_(elt_pk_),
         _pn_=_cP_(x_pl_[1],_pm_);}
      else
       var _pn_=_mj_;
      return _pn_;}
    /*<<49973: src/draw.ml 359 27 49>>*/function pixel_str_of_int_qt_(n_po_)
     {return _b5_(string_of_int_b6_(n_po_),_Z_);}
    caml_update_dummy
     (render_oF_,
      /*<<49163: src/draw.ml 361 18 81>>*/function(param_pp_)
       {switch(param_pp_[0])
         {case 1:
           var
            trans_pr_=param_pp_[2],
            match_pq_=_cP_(render_oF_,param_pp_[1]),
            elt_ps_=match_pq_[1],
            sub_pt_=match_pq_[2];
           return [0,
                   elt_ps_,
                   _ef_
                    (_mk_,_mW_(elt_ps_,_aB_,map_mq_(trans_pr_,_oA_)),sub_pt_)];
          case 2:
           var
            pts_pu_=param_pp_[3],
            props_pw_=param_pp_[2],
            name_pv_=param_pp_[1][1],
            _px_=[0,_az_,_jG_(_aA_,_jB_(peek_mo_(pts_pu_),_nx_))],
            elt_py_=
             _mZ_
              (_ax_,
               [0,
                [0,_ay_,render_properties_oD_(_jB_(props_pw_,peek_mo_))],
                _px_]),
            _pA_=mk_name_sub_pz_(name_pv_,elt_py_);
           return [0,
                   elt_py_,
                   _cP_(_ml_,[0,_mW_(elt_py_,_aw_,map_mq_(pts_pu_,_nC_)),_pA_])];
          case 3:
           var
            segs_pB_=param_pp_[5],
            mask_pG_=param_pp_[4],
            anchor_pF_=param_pp_[3],
            props_pE_=param_pp_[2],
            name_pD_=param_pp_[1][1],
            elt_pC_=_mZ_(_av_,[0]),
            _pI_=mk_name_sub_pz_(name_pD_,elt_pC_),
            _pN_=path_mask_pH_(elt_pC_,segs_pB_,mask_pG_,props_pE_);
           return [0,
                   elt_pC_,
                   _cP_
                    (_ml_,
                     [0,
                      _mW_
                       (elt_pC_,
                        _au_,
                        zip_with_mr_
                         (anchor_pF_,
                          segs_pB_,
                          function(param_pJ_,sgs_pK_)
                           {var y_pM_=param_pJ_[2],x_pL_=param_pJ_[1];
                            return _nH_
                                    (_h4_,_aH_,x_pL_,y_pM_,_jG_(_W_,_jB_(sgs_pK_,_oC_)));})),
                      _pN_,
                      _pI_])];
          case 4:
           var
            path_strb_pO_=param_pp_[4],
            mask_pS_=param_pp_[3],
            props_pR_=param_pp_[2],
            name_pQ_=param_pp_[1][1],
            elt_pP_=_mZ_(_at_,[0]),
            _pT_=mk_name_sub_pz_(name_pQ_,elt_pP_),
            _pU_=path_mask_pH_(elt_pP_,path_strb_pO_,mask_pS_,props_pR_);
           return [0,
                   elt_pP_,
                   _cP_(_ml_,[0,_mW_(elt_pP_,_as_,path_strb_pO_),_pU_,_pT_])];
          case 5:
           var
            text_pV_=param_pp_[4],
            corner_pW_=param_pp_[3],
            ps_pZ_=param_pp_[2],
            name_pY_=param_pp_[1][1],
            elt_pX_=_mZ_(_ar_,[0]),
            name_sub_p0_=mk_name_sub_pz_(name_pY_,elt_pX_);
           _mX_(elt_pX_,peek_mo_(text_pV_));
           var
            _p1_=_cP_(stop_on_removal_mG_,wrap_mE_(elt_pX_)),
            _p2_=_cP_(_mX_,elt_pX_),
            _p3_=_j__(iter_mn_(_ms_(text_pV_),_p2_),_p1_),
            _p5_=[0,_aq_,zip_props_pi_(ps_pZ_)],
            _p7_=[0,_ap_,y_beh_p4_(corner_pW_)];
           return [0,
                   elt_pX_,
                   _cP_
                    (_ml_,
                     [0,
                      name_sub_p0_,
                      _p3_,
                      sink_attrs_oE_
                       (elt_pX_,[0,[0,_ao_,x_beh_p6_(corner_pW_)],_p7_,_p5_])])];
          case 6:
           var
            hb_p8_=param_pp_[5],
            wb_p9_=param_pp_[4],
            corner_p__=param_pp_[3],
            ps_qa_=param_pp_[2],
            match_p$_=peek_mo_(corner_p__),
            y_qc_=match_p$_[2],
            x_qb_=match_p$_[1],
            _qd_=[0,_an_,render_properties_oD_(_jB_(ps_qa_,peek_mo_))],
            _qe_=[0,_am_,string_of_float_j7_(peek_mo_(hb_p8_))],
            _qf_=[0,_al_,string_of_float_j7_(peek_mo_(wb_p9_))],
            _qg_=[0,_ak_,string_of_float_j7_(y_qc_)],
            elt_qh_=
             _mZ_
              (_ai_,
               [0,[0,_aj_,string_of_float_j7_(x_qb_)],_qg_,_qf_,_qe_,_qd_]),
            _qi_=[0,_ah_,map_mq_(hb_p8_,string_of_float_j7_)],
            _qj_=[0,_ag_,map_mq_(wb_p9_,string_of_float_j7_)],
            _qk_=[0,_af_,y_beh_p4_(corner_p__)];
           return [0,
                   elt_qh_,
                   sink_attrs_oE_
                    (elt_qh_,[0,[0,_ae_,x_beh_p6_(corner_p__)],_qk_,_qj_,_qi_])];
          case 7:
           var elts_ql_=_jB_(param_pp_[1],render_oF_),elt_qm_=_mZ_(_ad_,[0]);
           _jC_
            (elts_ql_,
             /*<<49131: src/draw.ml 466 23 52>>*/function(param_qn_)
              {return _mY_(elt_qm_,param_qn_[1]);});
           return [0,
                   elt_qm_,
                   _cP_(_ml_,_jB_(elts_ql_,function(_qo_){return _qo_[2];}))];
          case 8:
           var
            heightb_qs_=param_pp_[3],
            widthb_qr_=param_pp_[2],
            urlb_qq_=param_pp_[1],
            elt_qp_=_mZ_(_ac_,[0]),
            _qu_=[0,_ab_,map_mq_(heightb_qs_,pixel_str_of_int_qt_)];
           return [0,
                   elt_qp_,
                   sink_attrs_oE_
                    (elt_qp_,
                     [0,
                      [0,_$_,urlb_qq_],
                      [0,_aa_,map_mq_(widthb_qr_,pixel_str_of_int_qt_)],
                      _qu_])];
          case 9:
           var
            tb_qv_=param_pp_[1],
            container_qw_=_mZ_(___,[0]),
            match_qx_=_cP_(render_oF_,peek_mo_(tb_qv_)),
            sub_qy_=match_qx_[2];
           _mY_(container_qw_,match_qx_[1]);
           var
            last_sub_qz_=[0,sub_qy_],
            _qE_=
             /*<<49094: src/draw.ml 475 6 22>>*/function(t_qB_)
              {/*<<49094: src/draw.ml 475 6 22>>*/_kb_(last_sub_qz_[1]);
               /*<<48110: src/jq.ml 97 6 71>>*/for(;;)
                {if(1-(container_qw_.firstChild==null_ig_?1:0))
                  {var _qA_=container_qw_.firstChild;
                   if(_qA_!=null_ig_)
                    /*<<48065: src/jq.ml 97 44 70>>*/container_qw_.removeChild
                     (_qA_);
                   continue;}
                 var match_qC_=_cP_(render_oF_,t_qB_),sub_qD_=match_qC_[2];
                 _mY_(container_qw_,match_qC_[1]);
                 last_sub_qz_[1]=sub_qD_;
                 return 0;}},
            dyn_sub_qG_=iter_mn_(_ms_(tb_qv_),_qE_);
           return [0,
                   container_qw_,
                   _ef_
                    (_mk_,
                     dyn_sub_qG_,
                     _lH_
                      (/*<<49086: src/draw.ml 482 61 77>>*/function(param_qF_)
                        {return _kb_(last_sub_qz_[1]);}))];
          case 10:return [0,param_pp_[1],_mj_];
          default:
           var
            center_qH_=param_pp_[4],
            r_qL_=param_pp_[3],
            ps_qK_=param_pp_[2],
            name_qJ_=param_pp_[1][1],
            elt_qI_=_mZ_(_aG_,[0]),
            name_sub_qM_=mk_name_sub_pz_(name_qJ_,elt_qI_),
            _qN_=[0,_aF_,zip_props_pi_(ps_qK_)],
            _qO_=[0,_aE_,map_mq_(r_qL_,string_of_float_j7_)],
            _qP_=[0,_aD_,y_beh_p4_(center_qH_)];
           return [0,
                   elt_qI_,
                   _ef_
                    (_mk_,
                     name_sub_qM_,
                     sink_attrs_oE_
                      (elt_qI_,[0,[0,_aC_,x_beh_p6_(center_qH_)],_qP_,_qO_,_qN_]))];}});
    var
     t_qQ_=unsafe_jq_mV_(_o_),
     _qR_=0===t_qQ_.length?0:[0,t_qQ_],
     main_container_qS_=_jl_(_qR_),
     height_q$_=match_g_[2],
     width_q__=match_g_[1],
     centers_q9_=[0,_l_,_m_,_n_],
     circles_ra_=
      _jB_
       (centers_q9_,
        /*<<53218: src/circles.ml 17 39 61>>*/function(ctr_q2_)
         {var
           scale_qT_=1073741824,
           r1_qU_=_h9_(_h__),
           _qX_=(r1_qU_/scale_qT_+_h9_(_h__))/scale_qT_*80;
          function _q3_(_qY_)
           {return _mt_(_qY_,_qX_,function(param_qW_,x_qV_){return x_qV_;});}
          /*<<53231: src/circles.ml 12 4 60>>*/function _q8_(pos_q0_)
           {var _q1_=_jj_(function(_qZ_){return _qZ_;},pos_q0_);
            return 8e3/
                   Math.sqrt
                    (Math.pow(_q1_[1]-ctr_q2_[1],2)+
                     Math.pow(_q1_[2]-ctr_q2_[2],2));}
          return [0,
                  ctr_q2_,
                  _j__
                   (map_lU_
                     (map_lU_
                       (mouse_pos_no_,
                        /*<<47640: src/jq.ml 190 35 53>>*/function(param_q4_)
                         {var
                           y_q7_=param_q4_[2],
                           x_q6_=param_q4_[1],
                           o_q5_=main_container_qS_.offset();
                          return [0,
                                  x_q6_-o_q5_[_aM_.toString()]|0,
                                  y_q7_-o_q5_[_aN_.toString()]|0];}),
                      _q8_),
                    _q3_)];});
    /*<<52999: src/circles.ml 38 14 4>>*/function draw_segs_rE_(param_rb_)
     {var y0_rc_=param_rb_[2],far_x_rd_=3e3;
      return [0,
              [1,[0,0,y0_rc_]],
              [0,[0,far_x_rd_,far_x_rd_*param_rb_[1]+y0_rc_]]];}
    function tangent_lines_rR_(param_rg_,_re_)
     {var
       c2_rf_=_re_[1],
       c1_rh_=param_rg_[1],
       r2b_rw_=_re_[2],
       r1b_rv_=param_rg_[2];
      return zip_with_mr_
              (r1b_rv_,
               r2b_rw_,
               function(r1_rn_,r2_rm_)
                {var
                  y1_ri_=c1_rh_[2],
                  x1_rj_=c1_rh_[1],
                  _rk_=c2_rf_[2]-y1_ri_,
                  _rl_=c2_rf_[1]-x1_rj_,
                  d_ro_=Math.sqrt(Math.pow(_rl_,2)+Math.pow(_rk_,2)),
                  nx_rp_=_rl_/d_ro_,
                  ny_rq_=_rk_/d_ro_,
                  nr_rr_=(r2_rm_-r1_rn_)/d_ro_;
                 return _jj_
                         (/*<<53036: src/circles.ml 33 14 41>>*/function(k_rs_)
                           {var
                             _rt_=
                              nr_rr_*
                              nx_rp_-
                              k_rs_*
                              ny_rq_*
                              Math.sqrt(1-Math.pow(nr_rr_,2)),
                             _ru_=
                              nr_rr_*
                              ny_rq_+
                              k_rs_*
                              nx_rp_*
                              Math.sqrt(1-Math.pow(nr_rr_,2));
                            return [0,
                                    -_rt_/_ru_,
                                    -(r1_rn_-(_rt_*x1_rj_+_ru_*y1_ri_))/_ru_];},
                          _p_);});}
    /*<<52825: src/circles.ml 72 16 88>>*/function draw_circle_rS_(param_rx_)
     {var
       r_ry_=param_rx_[2],
       _rz_=return_mp_(param_rx_[1]),
       _rA_=return_mp_(_oz_(0,0,_e_,2)),
       _rB_=[0,return_mp_([0,_oy_]),_rA_],
       _rD_=0,
       props_rC_=[0,_rB_]?_rB_:[0];
      return [0,[0,_rD_],props_rC_,r_ry_,_rz_];}
    /*<<52695: src/circles.ml 77 2 49>>*/function draw_lines_rT_(data_b_rF_)
     {var
       segs_b_rG_=map_mq_(data_b_rF_,_cP_(_jj_,draw_segs_rE_)),
       _rH_=_ie_(256),
       _rI_=_ie_(256),
       _rJ_=[0,_ie_(256),_rI_,_rH_,1],
       _rL_=map_mq_(segs_b_rG_,function(_rK_){return _rK_[2];}),
       _rM_=return_mp_(_s_),
       _rO_=path_oB_(0,[0,[0,return_mp_(_oz_(0,0,_rJ_,2))]],0,_rM_,_rL_),
       _rP_=map_mq_(segs_b_rG_,function(_rN_){return _rN_[1];}),
       _rQ_=return_mp_(_r_);
      return [0,
              path_oB_(0,[0,[0,return_mp_(_oz_(0,0,_rJ_,2))]],0,_rQ_,_rP_),
              _rO_];}
    var
     _rU_=
      tangent_lines_rR_
       (caml_array_get(circles_ra_,2),caml_array_get(circles_ra_,0)),
     _rV_=
      tangent_lines_rR_
       (caml_array_get(circles_ra_,1),caml_array_get(circles_ra_,2)),
     lines_data_rW_=
      [0,
       tangent_lines_rR_
        (caml_array_get(circles_ra_,0),caml_array_get(circles_ra_,1)),
       _rV_,
       _rU_];
    /*<<52640: src/circles.ml 96 26 90>>*/function intersection_pt_sb_(i_r6_)
     {/*<<52631: src/circles.ml 96 53 89>>*/function _r7_(param_rX_)
       {var
         l2_rY_=param_rX_[2],
         l1_rZ_=param_rX_[1],
         slope2_r0_=l2_rY_[1],
         b1_r1_=l1_rZ_[2],
         slope1_r2_=l1_rZ_[1],
         b2_r4_=l2_rY_[2];
        if(slope1_r2_==slope2_r0_)
         var _r3_=_q_;
        else
         {var
           x_r5_=(b2_r4_-b1_r1_)/(slope1_r2_-slope2_r0_),
           _r3_=[0,x_r5_,slope1_r2_*x_r5_+b1_r1_];}
        return _r3_;}
      return map_mq_(caml_array_get(lines_data_rW_,i_r6_),_r7_);}
    function _sc_(p1_r9_,p2_r8_)
     {var
       y1_r__=p1_r9_[2],
       x1_r$_=p1_r9_[1],
       m_sa_=(p2_r8_[2]-y1_r__)/(p2_r8_[1]-x1_r$_);
      return draw_segs_rE_([0,m_sa_,y1_r__-x1_r$_*m_sa_]);}
    var
     _sd_=intersection_pt_sb_(1),
     _se_=zip_with_mr_(intersection_pt_sb_(0),_sd_,_sc_),
     _sf_=return_mp_(_k_),
     _sh_=
      [0,[0,path_oB_(0,[0,[0,return_mp_(_oz_(0,0,_e_,2))]],0,_sf_,_se_)],0],
     _sg_=_jB_(lines_data_rW_,draw_lines_rT_),
     i_si_=_sg_.length-1-1|0,
     res_sj_=0;
    for(;;)
     {if(0<=i_si_)
       {var
         _sl_=[0,_sg_[i_si_+1],res_sj_],
         _sk_=i_si_-1|0,
         i_si_=_sk_,
         res_sj_=_sl_;
        continue;}
      var
       _sm_=[0,_b9_(res_sj_),_sh_],
       elt_sn_=
        _cP_(render_oF_,[7,_b9_([0,_jB_(circles_ra_,draw_circle_rS_),_sm_])])
         [1],
       _so_=[0,_aK_,string_of_int_b6_(height_q$_)],
       svg_sp_=_mZ_(_aI_,[0,[0,_aJ_,string_of_int_b6_(width_q__)],_so_]);
      _mY_(svg_sp_,elt_sn_);
      var
       _ss_=main_container_qS_.get(0),
       _st_=/*<<24991: js.ml 98 54 60>>*/function(x_sq_){return [0,x_sq_];};
      _mY_
       (_jl_
         (_il_
           (_ss_,
            /*<<24988: js.ml 98 38 42>>*/function(param_sr_){return 0;},
            _st_)),
        svg_sp_);
      do_at_exit_b7_(0);
      return;}}
  ());
