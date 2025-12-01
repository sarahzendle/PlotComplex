import surfGlsl from './surfaceVert.glsl';
import sphereGlsl from './sphereVert.glsl';
import surfFragGlsl from './surfaceFrag.glsl';
import sphereFragGlsl from './sphereFrag.glsl';

export function getVertexShader(injection = 'position', plotType = 'none'): string {
  const search = '/* !EXPRESSION! */';
  let output = '';

  if(plotType === 'surface') {
    output = surfGlsl.replaceAll(search, injection);
  }
  else if(plotType === 'sphere') {
    output = sphereGlsl.replaceAll(search, injection);
  }
  else {
    throw new Error(`Plot type '${plotType}' is not supported`);
  }

  return output;
}

export function getFragmentShader(injection = 'position', plotType = 'none'): string {
  if( plotType === 'surface') {
    return surfFragGlsl;
  }
  else if( plotType === 'sphere') {
    const search = '/* !EXPRESSION! */';
    console.log('injection:', injection);
    let output = sphereFragGlsl.replaceAll(search, injection);
    return output.replaceAll('position', 'z');
  }
  else {
    throw new Error(`Plot type '${plotType}' is not supported`);
  }
}
