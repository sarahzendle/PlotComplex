import './styles/css/App.css';
import { Card } from './components';
import { AppModel } from './models/AppModel';

import {
  absolute,
  flex,
  flexCenter,
  flexColumn,
  flexValue,
  fullSize,
  padding,
} from './styles';

import utilsGlsl from './glsl/utils.glsl';
import { Canvas } from './components/Canvas';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';

export const appModel = new AppModel();

console.log(utilsGlsl);

const App = observer(() => {
  console.log(appModel.state);

  return (
    <div css={[absolute(), fullSize, flexCenter]}>
      <Card
        css={[{ width: 'min(90%, 800px)', height: 'min(90%, 800px)' }, padding('xl')]}
      >
        <div css={[fullSize, flexColumn, { gap: 10 }]}>
          <div css={[flex('row'), { gap: 10 }]}>
            <input
              value={appModel.inputValue}
              placeholder="sin(1/z)"
              onChange={action((e) => {
                appModel.inputValue = e.currentTarget.value;
              })}
              css={{
                border: appModel.state === 'good' ? '1px solid black' : '1px solid red',
                '&:active, &:focus': {
                  outline: 'none',
                  border: appModel.state === 'good' ? '2px solid black' : '2px solid red',
                },
              }}
              type="text"
            />
            <button css={{ padding: 5 }}>Plot</button>
          </div>
          <div css={flexValue(1)}>
            <Canvas />
          </div>
        </div>
      </Card>
    </div>
  );
});

export default App;
