import './styles/css/App.css';
import { Card } from './components';
import { AppModel } from './models/AppModel';

import { absolute, flexCenter, fullSize, padding } from './styles';

export const appModel = new AppModel();

function App() {
  return (
    <div css={[absolute(), fullSize, flexCenter]}>
      <Card
        css={[{ width: 'min(90%, 400px)', height: 'min(90%, 400px)' }, padding('xl')]}
      >
        Test
      </Card>
    </div>
  );
}

export default App;
