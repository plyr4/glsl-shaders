#ifdef GL_ES
precision mediump float;
#endif

// this is a hack to make it easier to run the shader in shadertoy
#if __VERSION__<300
// shadertoy uniforms
uniform vec3 iResolution;
uniform float iTime;

// glslViewer uniforms
uniform float u_time;
uniform vec2 u_resolution;
#endif

// https://iquilezles.org/articles/distfunctions2d/
float sdEquilateralTriangle(in vec2 p,in float r, float variance)
{
    float time  = u_time;
    // float r2 = r;

    float r2 = r * variance;
    // float r2 = mod(r + ((speed * time) * time), u_resolution.x);

    // center the oscillation
    p.y = p.y - (r2 - r);
    r = r2;

    float k=sqrt(3.);
    p=-p;
    p.x=abs(p.x)-r;
    p.y=p.y-r/k;
    if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
    p.x-=clamp(p.x,-2.*r,0.);
    return-length(p)*sign(p.y);
}

// https://iquilezles.org/articles/distfunctions2d/
float sdStar5(in vec2 p,in float r,in float rf, float variance)
{
    float time  = u_time;
    float r2 = r * variance;
    // float r2 = mod(r + ((speed * time) * time), u_resolution.x);

    // p.y = p.y + abs(r2-r) * 3.;
    p.y = p.y - (r2 - r);
    p.x = p.x - (r2 - r) * 2.;
    r = r2;
    const vec2 k1=vec2(.809016994375,-.587785252292);
    const vec2 k2=vec2(-k1.x,k1.y);
    p.x=abs(p.x);
    p-=2.*max(dot(k1,p),0.)*k1;
    p-=2.*max(dot(k2,p),0.)*k2;
    p.x=abs(p.x);
    p.y-=r;
    vec2 ba=rf*vec2(-k1.y,k1.x)-vec2(0,1);
    float h=clamp(dot(p,ba)/dot(ba,ba),0.,r);
    return length(p-ba*h)*sign(p.y*ba.x-p.x*ba.y);
}

// https://www.ronja-tutorials.com/post/035-2d-sdf-combination/
float merge(float shape1,float shape2){
    return min(shape1,shape2);
}

// https://www.ronja-tutorials.com/post/035-2d-sdf-combination/
float intersect(float shape1,float shape2){
    return max(shape1,shape2);
}
// returns pixel color for rendering the vela logo using math
void vela(out vec4 fragColor,in vec2 fragCoord,vec2 resolution,float time, float variance)
{
    vec3 red=vec3(1.,0.,0.);
    vec3 green=vec3(.2,.8,.2);
    vec3 cyan=vec3(.01,1.,1.);
    vec3 lavender=vec3(.6,.2,.7);
    

    vec2 uv=fragCoord/resolution.xy;
    vec2 p=vec2(fragCoord.x-(resolution.x*.5),fragCoord.y-(resolution.y*.5));

    float speed = 20.;
    float height=0.;
    float size=160.;
    vec2 trianglePos=vec2(p.x,p.y-height);
    float triangle=1.-smoothstep(1.,2.,abs(sdEquilateralTriangle(trianglePos,size, variance)));
    vec3 tt=triangle*cyan;


    float starSize=size/6.;
    vec2 starPos=trianglePos+vec2(-size,size/2.);
    float star=smoothstep(1.,2.,abs(sdStar5(starPos,starSize,2., variance)));

    // combine the shapes
    vec3 ss=(1.-star)*lavender;
    vec3 o=mix(tt,ss,.5)*2.;
    float inter=step(1.,intersect(1.-triangle,star));
    o=o*inter+((1.-inter)*lavender);
    fragColor=vec4(o,1.);
}


// driver for shadertoy.
void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 resolution=iResolution.xy;
    float time=iTime;
    vela(fragColor,fragCoord.xy,resolution,time, 1.);
}

// driver for glslViewer, glsl sandbox, etc.
void main(void){
    vec4 fragColor=gl_FragColor;
    vec2 fragCoord=gl_FragCoord.xy;
    vec2 resolution=u_resolution.xy;
    float time=u_time;

    vec2 uv = (fragCoord * 2. - resolution.xy)/resolution.y;

    // float d = length(uv);
    float d = 0.;
    d = sin(d * 8. + u_time) / 8.;
    d  = clamp(abs(d),0.,1.);
    d = 1. - smoothstep(0.,0.1,d);

    // d = 1.;
    vela(fragColor,fragCoord.xy,resolution,time, d);

    // fragColor = vec4(d, d, d, 1.0);

    gl_FragColor=fragColor;
}


