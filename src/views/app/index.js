import { Config } from '../config';
import { Navigator } from '../navigator';
import { Player } from '../player';
import { Playlist } from '../playlist';
import './style.css';

export const App = () => (
  <div className="app">
    <div className="app__navigation">
      <Config />
      <Navigator />
    </div>
    <div className="app__media">
      <Player />
      <Playlist />
    </div>
  </div>
);
