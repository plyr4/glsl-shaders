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

// driver for shadertoy.
void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 resolution=iResolution.xy;
    float time=iTime;
    float cosWave=.3+.25*abs(cos(.8*time+0.));
    float variance=cosWave;
}

// driver for glslViewer, glsl sandbox, etc.
void main(void){
    vec4 fragColor=gl_FragColor;
    vec2 fragCoord=gl_FragCoord.xy;
    vec2 resolution=u_resolution.xy;
    float time=u_time;
    
    vec2 uv=(fragCoord*2.-resolution.xy)/resolution.y;
    
    // variance types
    float sinWave=0.;
    sinWave=sin(sinWave*8.+time)/8.;
    sinWave=clamp(abs(sinWave),0.,1.);
    sinWave=1.-smoothstep(0.,.1,sinWave);
    
    float cosWave=.3+.25*abs(cos(.2*time+0.));
    
    float frequency=2.;
    float sharktooth=oscillate(time,frequency);
    
    float variance=sharktooth;
    variance=sinWave;
    variance=cosWave;
    
    gl_FragColor=fragColor;
}
