import mainGlsl from './main.glsl';
import fragGlsl from './frag.glsl';

export function getVertexShader(injection = 'position'): string {
  const search = '/* !EXPRESSION! */';
  const output = mainGlsl.replaceAll(search, injection);

  console.log(output);
  return output;
}

export function getFragmentShader(): string {
  return fragGlsl;
}
