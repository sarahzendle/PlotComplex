// from https://gist.github.com/Jozo132/2c0fae763f5dc6635a6714bb741d152f
// convert a string of IEEE hexadecimal into its float32 value
// just jumping through the necessary hoops to communicate between untyped js and typed glsl
const HexToFloat32 = (str) => {
    var int = parseInt(str, 16);
    if (int > 0 || int < 0) {
        var sign = (int >>> 31) ? -1 : 1;
        var exp = (int >>> 23 & 0xff) - 127;
        var mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
        var float32 = 0
        for (i = 0; i < mantissa.length; i += 1) { float32 += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0; exp-- }
        return float32 * sign;
    } else return 0
}

// really big floats are reserved for functions and operators
const Z = HexToFloat32("0x7f7fffff");
const MULT = HexToFloat32("0x7f7ffffe");
const DIV = HexToFloat32("0x7f7ffffd");
const ADD = HexToFloat32("0x7f7ffffc");
const SUB = HexToFloat32("0x7f7ffffb");
const LOG = HexToFloat32("0x7f7ffffa");
const SQRT = HexToFloat32("0x7f7ffff9");
const POW = HexToFloat32("0x7f7ffff8");
const SIN = HexToFloat32("0x7f7ffff7");
const COS = HexToFloat32("0x7f7fff6");
const TAN = HexToFloat32("0x7f7ffff5");
const SINH = HexToFloat32("0x7f7ffff4");
const COSH = HexToFloat32("0x7f7ffff3");
const TANH = HexToFloat32("0x7f7ffff2");
const END = HexToFloat32("0x7f7ffff1");
const ERR = HexToFloat32("0x7f7ffff0");

//maximum equation array size
const MAX_SIZE = 20;

const ThrowErr = (err) => {
    console.log(err);
    document.getElementById("error").innerHTML = err;
}

function Sin(th) {
    return Math.sin(th * Math.PI / 180)
}
 
function Cos(th) {
    return Math.cos(th * Math.PI / 180)
}

function SphereVertex(data, th, ph) {
    var x = Cos(th)*Cos(ph);
    var z = Sin(th)*Cos(ph);
    var y =         Sin(ph);
    //vertex
    data.push(x);
    data.push(y);
    data.push(z);
    data.push(1);
    //normal
    data.push(x);
    data.push(y);
    data.push(z);
    //color
    data.push(x);
    data.push(y);
    data.push(z);
    data.push(1);
    //texture
    data.push(th/360*2);
    data.push(-ph/180+0.5);
 
    return data;
}
 
function GenerateSphere(n) {
    var sphere_data = [];
    for (var i=0;i<=n;i++)
    {
       var ph0 =   i  *(180.0/n)-90;
       var ph1 = (i+1)*(180.0/n)-90;
       for (var j=0;j<=n;j++)
       {
          var th0 = j*360.0/n;
          var th1 = (j+1)*360.0/n;
          if(ph0 == 90 || ph1 ==90) {
          }
          sphere_data = SphereVertex(sphere_data, th0, ph0);
          sphere_data = SphereVertex(sphere_data, th0, ph1);
          sphere_data = SphereVertex(sphere_data, th1, ph1);
 
          sphere_data = SphereVertex(sphere_data, th1, ph1);
          sphere_data = SphereVertex(sphere_data, th0, ph0);
          sphere_data = SphereVertex(sphere_data, th1, ph0);
       }
    }
    return sphere_data;
}

