import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';

declare const maketaConfig: any;
const Main = require(maketaConfig.entry);

const App = hot(Main.default);

ReactDOM.render(<App />, document.getElementById('root'));

export default null;
