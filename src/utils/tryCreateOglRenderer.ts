import { Renderer } from 'ogl';

/**
 * Constructs an OGL Renderer only when a WebGL context can be created.
 * OGL's Renderer throws if getContext fails (null.gl), so we probe first.
 */
export function tryCreateOglRenderer(
  options: ConstructorParameters<typeof Renderer>[0] = {}
): InstanceType<typeof Renderer> | null {
  const canvas = options.canvas ?? document.createElement('canvas');
  const {
    alpha = false,
    depth = true,
    stencil = false,
    antialias = false,
    premultipliedAlpha = false,
    preserveDrawingBuffer = false,
    powerPreference = 'default',
    webgl = 2
  } = options;

  const attributes = {
    alpha,
    depth,
    stencil,
    antialias,
    premultipliedAlpha,
    preserveDrawingBuffer,
    powerPreference
  };

  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  if (webgl === 2) {
    gl = canvas.getContext('webgl2', attributes) as WebGL2RenderingContext | null;
  }
  if (!gl) {
    gl = canvas.getContext('webgl', attributes) as WebGLRenderingContext | null;
  }
  if (!gl) {
    return null;
  }

  try {
    return new Renderer({ ...options, canvas });
  } catch {
    return null;
  }
}
