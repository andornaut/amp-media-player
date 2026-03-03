import { Config } from '../config';
import { Navigator } from '../navigator';
import { Player } from '../player';
import { Playlist } from '../playlist';
import './style.css';

export const App = ({ state }) => (
  <div className="app">
    <div className="app__navigation">
      <Config state={state} />
      <Navigator state={state} />
    </div>
    <div className="app__media">
      <Player state={state} />
      <Playlist state={state} />
    </div>
  </div>
);
