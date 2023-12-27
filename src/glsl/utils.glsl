const float PI = 3.1415926535897932384626433832795;

vec2 toPolar(vec2 cartesian) {
    float r = length(cartesian);
    float theta = atan(cartesian.y, cartesian.x);
    return vec2(r, theta);
}

vec2 toCartesian(vec2 polar) {
    return vec2(polar.x * cos(polar.y), polar.x * sin(polar.y));
}

vec2 complexAdd(vec2 a, vec2 b, float sheet) {
    return toPolar(toCartesian(a) + toCartesian(b));
}

vec2 complexMul(vec2 a, vec2 b, float sheet) {
    return vec2(a.x * b.x, a.y + b.y);
}

vec2 complexNegate(vec2 a, float sheet) {
    return vec2(a.x, a.y + PI);
}

vec2 complexSub(vec2 a, vec2 b, float sheet) {
    return toPolar(toCartesian(a) - toCartesian(b));
}

vec2 complexDiv(vec2 a, vec2 b, float sheet) {
    return vec2(a.x / b.x, a.y - b.y);
}

vec2 complexConjugate(vec2 z, float sheet) {
    return vec2(z.x, -z.y);
}

float complexDisplay(vec2 z, float sheet) {
    return z.x + z.y;
}

float complexPolarMagnitude(vec2 z, float sheet) {
    return z.x;
}

float complexArgument(vec2 z, float sheet) {
    return z.y;
}

vec2 complexLog(vec2 z, float sheet) {
    return vec2(log(z.x), z.y + sheet * 2.0 * PI);
}

vec2 complexExp(vec2 z, float sheet) {
    return vec2(exp(z.x) * cos(z.y), exp(z.x) * sin(z.y));
}

vec2 complexPow(vec2 z, vec2 w, float sheet) {
    float r = pow(z.x, w.x);
    float theta = z.y * w.x;
    if (w.y != 0.0) {
        r *= exp(-w.y * z.y);
        theta += w.y * log(z.x);
    }
    return vec2(r, theta);
}

vec2 complexSin(vec2 z, float sheet) {
    vec2 cz = toCartesian(z);
    return toPolar(vec2(sin(cz.x) * cosh(cz.y), cos(cz.x) * sinh(cz.y)));
}

vec2 complexCos(vec2 z, float sheet) {
    vec2 cz = toCartesian(z);
    return toPolar(vec2(cos(cz.x) * cosh(cz.y), -sin(cz.x) * sinh(cz.y)));
}

vec2 complexTan(vec2 z, float sheet) {
    vec2 cz = toCartesian(z);
    float denom = cos(2.0 * cz.x) + cosh(2.0 * cz.y);
    return toPolar(vec2(sin(2.0 * cz.x) / denom, sinh(2.0 * cz.y) / denom));
}

vec2 complexSinh(vec2 z, float sheet) {
    vec2 cz = toCartesian(z);
    return toPolar(vec2(sinh(cz.x) * cos(cz.y), cosh(cz.x) * sin(cz.y)));
}

vec2 complexCosh(vec2 z, float sheet) {
    vec2 cz = toCartesian(z);
    return toPolar(vec2(cosh(cz.x) * cos(cz.y), sinh(cz.x) * sin(cz.y)));
}

vec2 complexTanh(vec2 z, float sheet) {
    vec2 cz = toCartesian(z);
    float denom = cosh(2.0 * cz.x) + cos(2.0 * cz.y);
    return toPolar(vec2(sinh(2.0 * cz.x) / denom, sin(2.0 * cz.y) / denom));
}

vec2 complexSqrt(vec2 z, float sheet) {
    float r = sqrt(z.x);
    float theta = (z.y + sheet * 2.0 * PI) / 2.0;
    return vec2(r, theta);
}

float complexRe(vec2 z, float sheet) {
    return z.x * cos(z.y);
}

float complexIm(vec2 z, float sheet) {
    return z.x * sin(z.y);
}

vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}