import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';

declare const maketaConfig: any;
const Main = require(maketaConfig.entry);

let triggerResize;
function triggerResizeHandler(f) {
  triggerResize = f;
}

const App = () => {
  return <Main.default triggerResize={triggerResizeHandler} />
}

window.addEventListener('resize', () => {
  triggerResize && triggerResize();
});

const HotApp = hot(App);

ReactDOM.render(<HotApp />, document.getElementById('root'));

export default null;
