import { useRef, useEffect } from 'react';

import './style.css';
import { resetPlayer, togglePlayPause } from '../../actions/player';
import {
  selectNextPlaylistItem,
  selectPreviousPlaylistItem,
} from '../../actions/playlist';
import { toTitle } from '../../transform';

export const Player = ({ state }) => {
  const { isPlaying, url } = state.player || {};
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('ended', selectNextPlaylistItem);

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', togglePlayPause);
      navigator.mediaSession.setActionHandler('pause', togglePlayPause);
      navigator.mediaSession.setActionHandler(
        'previoustrack',
        selectPreviousPlaylistItem,
      );
      navigator.mediaSession.setActionHandler(
        'nexttrack',
        selectNextPlaylistItem,
      );
    }

    // eslint-disable-next-line consistent-return
    return () => {
      audio.removeEventListener('ended', selectNextPlaylistItem);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!url) {
      audio.src = '';
      audio.pause();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
        navigator.mediaSession.metadata = null;
      }
      return;
    }

    if (audio.src !== url) {
      audio.src = url;
    }

    if (isPlaying) {
      audio.play().catch(() => {
        /* ignore play() interruptions */
      });
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: toTitle(url),
          artist: 'amp-media-player',
          album: 'amp-media-player',
        });
      }
    } else {
      audio.pause();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    }
  }, [isPlaying, url]);

  return (
    <div className="player">
      <audio ref={audioRef} className="player__media" controls preload="">
        Sorry, this media format is not supported.
      </audio>
      {url && (
        <div className="player__title">
          {toTitle(url)}
          <a
            className="player__clear-button"
            onClick={resetPlayer}
            title="Clear"
          >
            ✖
          </a>
        </div>
      )}
    </div>
  );
};
