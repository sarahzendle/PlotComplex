export const PI = 3.1415926535897932384626433832795;

export interface Vec2 { x: number, y: number };
export interface Vec3 extends Vec2 { z: number };

export function toPolar(cartesian: Vec2): Vec2 {
    const r = Math.hypot(cartesian.x, cartesian.y);
    const theta = Math.atan2(cartesian.y, cartesian.x);
    return { x: r, y: theta };
}

export function toCartesian(polar: Vec2): Vec2 {
    return { 
        x: polar.x * Math.cos(polar.y), 
        y: polar.x * Math.sin(polar.y) 
    };
}

export function complexAdd(a: Vec2, b: Vec2, sheet: number): Vec2 {
    const cartesianSum = {
        x: toCartesian(a).x + toCartesian(b).x,
        y: toCartesian(a).y + toCartesian(b).y
    };
    return toPolar(cartesianSum);
}

export function complexMul(a: Vec2, b: Vec2, sheet: number): Vec2 {
    return { x: a.x * b.x, y: a.y + b.y };
}

export function complexNegate(a: Vec2, sheet: number): Vec2 {
    return { x: a.x, y: a.y + PI };
}

export function complexSub(a: Vec2, b: Vec2, sheet: number): Vec2 {
    const cartesianDiff = {
        x: toCartesian(a).x - toCartesian(b).x,
        y: toCartesian(a).y - toCartesian(b).y
    };
    return toPolar(cartesianDiff);
}

export function complexDiv(a: Vec2, b: Vec2, sheet: number): Vec2 {
    return { x: a.x / b.x, y: a.y - b.y };
}

export function complexConjugate(z: Vec2, sheet: number): Vec2 {
    return { x: z.x, y: -z.y };
}

export function complexDisplay(z: Vec2, sheet: number): number {
    return z.x + z.y;
}

export function complexMagnitude(z: Vec2, sheet: number): number {
    return z.x;
}

export function complexArgument(z: Vec2, sheet: number): number {
    return z.y;
}

export function complexLog(z: Vec2, sheet: number): Vec2 {
    return { x: Math.log(z.x), y: z.y + sheet * 2.0 * PI };
}

export function complexExp(z: Vec2, sheet: number): Vec2 {
    return { 
        x: Math.exp(z.x) * Math.cos(z.y), 
        y: Math.exp(z.x) * Math.sin(z.y) 
    };
}

export function complexPow(z: Vec2, w: Vec2, sheet: number): Vec2 {
    let r = Math.pow(z.x, w.x);
    let theta = z.y * w.x;
    if (w.y !== 0.0) {
        r *= Math.exp(-w.y * z.y);
        theta += w.y * Math.log(z.x);
    }
    return { x: r, y: theta };
}

export function complexSin(z: Vec2, sheet: number): Vec2 {
    const cz = toCartesian(z);
    return toPolar({ 
        x: Math.sin(cz.x) * Math.cosh(cz.y), 
        y: Math.cos(cz.x) * Math.sinh(cz.y) 
    });
}

export function complexCos(z: Vec2, sheet: number): Vec2 {
    const cz = toCartesian(z);
    return toPolar({ 
        x: Math.cos(cz.x) * Math.cosh(cz.y), 
        y: -Math.sin(cz.x) * Math.sinh(cz.y) 
    });
}

export function complexTan(z: Vec2, sheet: number): Vec2 {
    const cz = toCartesian(z);
    const denom = Math.cos(2.0 * cz.x) + Math.cosh(2.0 * cz.y);
    return toPolar({ 
        x: Math.sin(2.0 * cz.x) / denom, 
        y: Math.sinh(2.0 * cz.y) / denom 
    });
}

export function complexSinh(z: Vec2, sheet: number): Vec2 {
    const cz = toCartesian(z);
    return toPolar({ 
        x: Math.sinh(cz.x) * Math.cos(cz.y), 
        y: Math.cosh(cz.x) * Math.sin(cz.y) 
    });
}

export function complexCosh(z: Vec2, sheet: number): Vec2 {
    const cz = toCartesian(z);
    return toPolar({ 
        x: Math.cosh(cz.x) * Math.cos(cz.y), 
        y: Math.sinh(cz.x) * Math.sin(cz.y) 
    });
}

export function complexTanh(z: Vec2, sheet: number): Vec2 {
    const cz = toCartesian(z);
    const denom = Math.cosh(2.0 * cz.x) + Math.cos(2.0 * cz.y);
    return toPolar({ 
        x: Math.sinh(2.0 * cz.x) / denom, 
        y: Math.sin(2.0 * cz.y) / denom 
    });
}

export function complexSqrt(z: Vec2, sheet: number): Vec2 {
    const r = Math.sqrt(z.x);
    const theta = (z.y + sheet * 2.0 * PI) / 2.0;
    return { x: r, y: theta };
}

export function complexRe(z: Vec2, sheet: number): number {
    return z.x * Math.cos(z.y);
}

export function complexIm(z: Vec2, sheet: number): number {
    return z.x * Math.sin(z.y);
}

export function hsl2rgb(c: Vec3): Vec3 {
  const mod = (n: number, m: number) => ((n % m) + m) % m;
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

  const [r,g,b] = [0.0, 4.0, 2.0].map(v => {
      return clamp(Math.abs(mod(c.x * 6.0 + v, 6.0) - 3.0) - 1.0, 0.0, 1.0);
  });

  return {
      x: c.z + c.y * (r - 0.5) * (1.0 - Math.abs(2.0 * c.z - 1.0)),
      y: c.z + c.y * (g - 0.5) * (1.0 - Math.abs(2.0 * c.z - 1.0)),
      z: c.z + c.y * (b - 0.5) * (1.0 - Math.abs(2.0 * c.z - 1.0))
  };
}