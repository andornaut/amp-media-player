import { view } from 'jetstart/src';

import { config } from '../config';
import { navigator } from '../navigator';
import { player } from '../player';
import { playlist } from '../playlist';
import './style.css';

export const app = view(({ render }) => {
  render`
    <div class="app">
      <div class="app__navigation">
        ${config()}
        ${navigator()}
      </div>
      <div class="app__media">
        ${player()}
        ${playlist()}
      </div>
    </div>`;
});
