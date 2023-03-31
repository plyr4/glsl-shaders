#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st) {    
    return smoothstep(0.02, 0.0, abs(st.y - st.x));
}

void mainImage( out vec4 fragColor, in vec4 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord.xy/u_resolution.xy;
    vec2 m = u_mouse.xy/u_resolution.xy;
    // Time varying pixel color
    // vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    vec4 col = vec4(0,1,0, 1);
    float distanceFromMouse = distance(uv, m.xy);
    vec4 oooo = vec4(0,0,0,0) + col - distanceFromMouse;
    // Output to screen
    fragColor = oooo;   
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord);
}