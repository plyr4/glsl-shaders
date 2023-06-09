
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2    u_resolution;
uniform float   u_time;
uniform mat4    u_modelViewProjectionMatrix;
uniform mat4    u_projectionMatrix;
uniform mat4    u_modelMatrix;
uniform mat4    u_viewMatrix;
uniform mat3    u_normalMatrix;

attribute vec4  a_position;
varying vec4    v_position;

#ifdef MODEL_VERTEX_COLOR
attribute vec4  a_color;
varying vec4    v_color;
#endif

#ifdef MODEL_VERTEX_NORMAL
attribute vec3  a_normal;
varying vec3    v_normal;
#endif

#ifdef MODEL_VERTEX_TEXCOORD
attribute vec2  a_texcoord;
varying vec2    v_texcoord;
#endif

#ifdef MODEL_VERTEX_TANGENT
attribute vec4  a_tangent;
varying vec4    v_tangent;
varying mat3    v_tangentToWorld;
#endif

#ifdef LIGHT_SHADOWMAP
uniform mat4    u_lightMatrix;
varying vec4    v_lightCoord;
#endif

void main(void) {
    
    v_position = u_modelMatrix * a_position;
    
#ifdef MODEL_VERTEX_COLOR
    v_color = a_color;
#endif
    
#ifdef MODEL_VERTEX_NORMAL
    v_normal = vec4(u_modelMatrix * vec4(a_normal, 0.0) ).xyz;
#endif
    
#ifdef MODEL_VERTEX_TEXCOORD
    v_texcoord = a_texcoord;
#endif
    
#ifdef MODEL_VERTEX_TANGENT
    v_tangent = a_tangent;
    vec3 worldTangent = a_tangent.xyz;
    vec3 worldBiTangent = cross(v_normal, worldTangent);// * sign(a_tangent.w);
    v_tangentToWorld = mat3(normalize(worldTangent), normalize(worldBiTangent), normalize(v_normal));
#endif
    
#ifdef LIGHT_SHADOWMAP
    v_lightCoord = u_lightMatrix * v_position;
#endif
    vec4 v_p = vec4(v_position.x * (abs(cos(u_time))),v_position.y,v_position.z,v_position.w);
    gl_Position = u_projectionMatrix * u_viewMatrix * v_p;
    // gl_Position = u_modelViewProjectionMatrix * v_position;
}
