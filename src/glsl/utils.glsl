vec2 complexAdd(vec2 a, vec2 b) {
    return vec2(a.x + b.x, a.y + b.y);
}

vec2 complexMul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 complexNegate(vec2 a) {
    return vec2(-a.x, -a.y);
}

vec2 complexSub(vec2 a, vec2 b) {
    return vec2(a.x - b.x, a.y - b.y);
}

vec2 complexDiv(vec2 a, vec2 b) {
    float denom = b.x * b.x + b.y * b.y;
    return vec2((a.x * b.x + a.y * b.y) / denom, (a.y * b.x - a.x * b.y) / denom);
}

vec2 complexConjugate(vec2 z) {
    return vec2(z.x, -z.y);
}

float complexMagnitude(vec2 z) {
    return sqrt(z.x * z.x + z.y * z.y);
}

float complexArgument(vec2 z) {
    return atan(z.y, z.x);
}

vec2 complexLog(vec2 z) {
    return vec2(log(length(z)), atan(z.y, z.x));
}

vec2 complexExp(vec2 z) {
    float exp_x = exp(z.x);
    return vec2(exp_x * cos(z.y), exp_x * sin(z.y));
}

vec2 complexPow(vec2 z, vec2 w) {
    float r = length(z);
    float theta = atan(z.y, z.x);
    float log_r = log(r);
    float exp_part = exp(w.x * log_r - w.y * theta);
    float arg_part = w.x * theta + w.y * log_r;
    return vec2(exp_part * cos(arg_part), exp_part * sin(arg_part));
}

vec2 complexSin(vec2 z) {
    return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));
}

vec2 complexCos(vec2 z) {
    return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y));
}

vec2 complexTan(vec2 z) {
    float denom = cos(2.0 * z.x) + cosh(2.0 * z.y);
    return vec2(sin(2.0 * z.x) / denom, sinh(2.0 * z.y) / denom);
}

vec2 complexSinh(vec2 z) {
    return vec2(sinh(z.x) * cos(z.y), cosh(z.x) * sin(z.y));
}

vec2 complexCosh(vec2 z) {
    return vec2(cosh(z.x) * cos(z.y), sinh(z.x) * sin(z.y));
}

vec2 complexTanh(vec2 z) {
    float denom = cosh(2.0 * z.x) + cos(2.0 * z.y);
    return vec2(sinh(2.0 * z.x) / denom, sin(2.0 * z.y) / denom);
}

vec2 complexSqrt(vec2 z) {
    float r = length(z);
    float sqrtR = sqrt(r);
    float angle = atan(z.y, z.x) / 2.0;
    return vec2(sqrtR * cos(angle), sqrtR * sin(angle));
}

float complexRe(vec2 z) {
    return z.x; 
}

float complexIm(vec2 z) {
    return z.y;
}

vec3 hsl2rgb( vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}