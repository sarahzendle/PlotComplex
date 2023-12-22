import './styles/css/App.css';
import { Card } from './components';
import { AppModel } from './models/AppModel';

import { absolute, flexCenter, fullSize, padding } from './styles';

import utilsGlsl from './glsl/utils.glsl';
import { Canvas } from './components/Canvas';

export const appModel = new AppModel();

console.log(utilsGlsl);

function App() {
  return (
    <div css={[absolute(), fullSize, flexCenter]}>
      <Card
        css={[{ width: 'min(90%, 700px)', height: 'min(90%, 700px)' }, padding('xl')]}
      >
        <Canvas />
      </Card>
    </div>
  );
}

export default App;
