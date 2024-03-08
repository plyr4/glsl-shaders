# glsl-shaders

A playground for creating cool [glsl](https://www.khronos.org/files/opengles_shading_language.pdf) shaders.

## Running the shaders

### Shadertoy

Use [Shadertoy](https://www.shadertoy.com) to run fragment shaders found in `frag/` in the browser.

- Shadertoy uses the `void mainImage()` driver function that is (hopefully) provided in the `.frag` file.
- Shadertoy defines its own `void main()` to run the shader so the provided function needs to be removed before it will work.
- Shadertoy provides various `uniform` variables as standard input, so the `.frag` files in this repo contain `#if` macro workarounds to make it easier for them to work in both Shadetoy and [`glslViewer`](https://github.com/patriciogonzalezvivo/glslViewer).

1. Find a fragment shader in `frag/`.
2. Visit [Shadertoy](https://www.shadertoy.com/new).
3. Copy/paste the fragment shader code.
4. Remove `main()` entirely.

### glslViewer

Use [`glslViewer`](https://github.com/patriciogonzalezvivo/glslViewer) to run fragment and vertex shaders locally. They should run out of the box if installed properly.

```bash
$ glslViewer frag/default.frag
```

Be sure to check the [wiki](https://github.com/patriciogonzalezvivo/glslViewer/wiki/) if that command isn't working.

