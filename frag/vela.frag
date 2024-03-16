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
uniform vec2 u_mouse;
#endif

// pallete
vec3 red=vec3(1.,0.,0.);
vec3 yellow=vec3(1.,.7843,0.);
vec3 green=vec3(.2,.8,.2);
vec3 cyan=vec3(.01,1.,1.);
vec3 lavender=vec3(.7569,.0667,.9255);

// https://iquilezles.org/articles/distfunctions2d/
float sdEquilateralTriangle(in vec2 p,in float r)
{
    float k=sqrt(3.);
    p=-p;
    p.x=abs(p.x)-r;
    p.y=p.y-r/k;
    if(p.x+k*p.y>0.)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.;
    p.x-=clamp(p.x,-2.*r,0.);
    return-length(p)*sign(p.y);
}

// https://iquilezles.org/articles/distfunctions2d/
float sdStar5(in vec2 p,in float r,in float rf)
{
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

// returns pixel color for rendering the vela logo using math
void vela(out vec4 fragColor,in vec2 fragCoord,vec2 resolution,float time)
{       
    float size = 1.25;
    // oscillating variance
    float cosWave=(.3+.25*abs(cos(.2*time+0.)))/(3./size);
    float variance=cosWave;
    
    vec2 p=(2.*fragCoord-resolution.xy)/resolution.y;
    vec3 pixelColor=vec3(0.,1.,1.)*.1;
    
    // triangle
    // for some reason if we move this variable lower, it breaks things
    vec3 triangleColor=yellow;
    vec2 trianglePos=vec2(p.x-0.,p.y-variance);
    // calculate shape
    float triangle=sdEquilateralTriangle(trianglePos,variance);
    
    bool inside=false;
    if(triangle>.01){
        inside=false;
    }else{
        inside=true;
    }
    
    // star
    float starSize=6.;
    vec2 starPos=trianglePos+vec2(-1.*variance,.5*variance);
    // calculate shape
    float star=sdStar5(starPos,variance*(1./starSize),2.);
    float starPulse=sin(2.*-((2./3.)*time)+(star));
    
    // track star pulse separate to apply to the background separately
    float star1=star;
    star1=star*starPulse;
    
    // base star color partially on triangle value
    vec3 starColor=vec3(5.)*abs(sin(triangle))*1.;
    if(starPulse>0.){
        starColor=lavender*starPulse;
        triangleColor=green;
    }
    
    // mix background color based on star pulse
    pixelColor=mix(pixelColor,vec3(.2),smoothstep(.005,.01,(star1)))*2.;
    pixelColor*=1.-exp(-3.*abs(triangle));
    
    // base V pulse animation
    float pulseSpeed=2.;
    float vPulse=sin((pulseSpeed*-(time)+triangle))/pulseSpeed;
    if(!inside){
        triangle*=vPulse;
    }
    
    // use this to oscillate the main V color
    if(abs(vPulse)>.02){
        triangleColor=cyan;
    }
    
    // oscillating size of animation
    float backgroundPulse=.8+.2*cos(50.*triangle+time*.1);
    // outer pulse
    if(!inside){
        pixelColor*=backgroundPulse;
    }
    
    // outer triangle
    pixelColor=mix(pixelColor,vec3(1.)*triangleColor,1.-smoothstep(.001,.008,abs(triangle)));
    
    // inner triangle
    trianglePos=vec2(p.x-0.,p.y-variance*.785);
    triangle=sdEquilateralTriangle(trianglePos,variance*.8);
    pixelColor=mix(pixelColor,vec3(1.),1.-smoothstep(.0025,.004 + 0.015*variance,abs(triangle)));
    
    // corner star
    pixelColor=mix(pixelColor,starColor,1.-smoothstep(0.,.002,(star)))*2.;
    
    fragColor=vec4(pixelColor,1.);
}

// driver for shadertoy.
void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 resolution=iResolution.xy;
    float time=iTime;

    vela(fragColor,fragCoord.xy,resolution,time);
}

// driver for glslViewer, glsl sandbox, etc.
void main(void){
    vec4 fragColor=gl_FragColor;
    vec2 fragCoord=gl_FragCoord.xy;
    vec2 resolution=u_resolution.xy;
    float time=u_time;

    vela(fragColor,fragCoord.xy,resolution,time);

    gl_FragColor=fragColor;
}
