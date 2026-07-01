// Animation transition inspired by the Beizer Curve with Two Points Function

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.585,0.017,1.000);
vec3 colorB = vec3(1.000,0.962,0.087);

// Helper functions:
float slopeFromT (float t, float A, float B, float C){
  float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C); 
  return dtdx;
}
float xFromT (float t, float A, float B, float C, float D){
  float x = A*(t*t*t) + B*(t*t) + C*t + D;
  return x;
}
float yFromT (float t, float E, float F, float G, float H){
  float y = E*(t*t*t) + F*(t*t) + G*t + H;
  return y;
}
float B0 (float t){
  return (1.0-t)*(1.0-t)*(1.0-t);
}
float B1 (float t){
  return  3.0*t*(1.0-t)*(1.0-t);
}
float B2 (float t){
  return 3.0*t*t* (1.0-t);
}
float B3 (float t){
  return t*t*t;
}
float  findx (float t, float x0, float x1, float x2, float x3){
  return x0*B0(t) + x1*B1(t) + x2*B2(t) + x3*B3(t);
}
float  findy (float t, float y0, float y1, float y2, float y3){
  return y0*B0(t) + y1*B1(t) + y2*B2(t) + y3*B3(t);
}

float cubicBezier(float x, vec2 a, vec2 b){
  float y0a = 0.0; // initial y
  float x0a = 0.0; // initial x 
  float y1a = a.y;    // 1st influence y   
  float x1a = a.x;    // 1st influence x 
  float y2a = b.y;    // 2nd influence y
  float x2a = b.x;    // 2nd influence x
  float y3a = 1.0; // final y 
  float x3a = 1.0; // final x 

  float A =   x3a - 3.0*x2a + 3.0*x1a - x0a;
  float B = 3.0*x2a - 6.0*x1a + 3.0*x0a;
  float C = 3.0*x1a - 3.0*x0a;   
  float D =   x0a;

  float E =   y3a - 3.0*y2a + 3.0*y1a - y0a;    
  float F = 3.0*y2a - 6.0*y1a + 3.0*y0a;             
  float G = 3.0*y1a - 3.0*y0a;             
  float H =   y0a;

  // Solve for t given x (using Newton-Raphelson), then solve for y given t.
  // Assume for the first guess that t = x.
  float currentt = x;
  for (int i=0; i < 5; i++){
    float currentx = xFromT (currentt, A,B,C,D); 
    float currentslope = slopeFromT (currentt, A,B,C);
    currentt -= (currentx - x)*(currentslope);
  	currentt = clamp(currentt,0.0,1.0); 
  } 

  float y = yFromT (currentt,  E,F,G,H);
  return y;
}

float cubicBezierNearlyThroughTwoPoints(float x, vec2 a, vec2 b){

  float y = 0.0;
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0 + epsilon;
  float max_param_b = 1.0 - epsilon;
  a.x = max(min_param_a, min(max_param_a, a.x));
  a.y = max(min_param_b, min(max_param_b, a.y));

  float x0 = 0.0;  
  float y0 = 0.0;
  float x4 = a.x;  
  float y4 = a.y;
  float x5 = b.x;  
  float y5 = b.y;
  float x3 = 1.0;  
  float y3 = 1.0;
  float x1,y1,x2,y2; // to be solved.

  // arbitrary but reasonable 
  // t-values for interior control points
  float t1 = 0.3;
  float t2 = 0.7;

  float B0t1 = B0(t1);
  float B1t1 = B1(t1);
  float B2t1 = B2(t1);
  float B3t1 = B3(t1);
  float B0t2 = B0(t2);
  float B1t2 = B1(t2);
  float B2t2 = B2(t2);
  float B3t2 = B3(t2);

  float ccx = x4 - x0*B0t1 - x3*B3t1;
  float ccy = y4 - y0*B0t1 - y3*B3t1;
  float ffx = x5 - x0*B0t2 - x3*B3t2;
  float ffy = y5 - y0*B0t2 - y3*B3t2;

  x2 = (ccx - (ffx*B1t1)/B1t2) / (B2t1 - (B1t1*B2t2)/B1t2);
  y2 = (ccy - (ffy*B1t1)/B1t2) / (B2t1 - (B1t1*B2t2)/B1t2);
  x1 = (ccx - x2*B2t1) / B1t1;
  y1 = (ccy - y2*B2t1) / B1t1;

  x1 = max(0.0+epsilon, min(1.0-epsilon, x1));
  x2 = max(0.0+epsilon, min(1.0-epsilon, x2));

  y = cubicBezier (x, vec2(x1,y1), vec2(x2,y2));
  y = max(0.0, min(1.0, y));
  return y;
}

void main() {
    vec3 color = vec3(0.0);

    float pct = abs(sin(u_time));

    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.488);
}