import { useEffect, useRef } from "react";

import "./style.css";
import { resetPlayer, setVolume, togglePlayPause } from "../../actions/player";
import {
  selectNextPlaylistItem,
  selectPreviousPlaylistItem,
} from "../../actions/playlist";
import { toTitle } from "../../transform";

export const Player = ({ state }) => {
  const { isPlaying, url, volume = 1 } = state.player || {};
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("ended", selectNextPlaylistItem);

    const onVolumeChange = () => {
      setVolume(audio.volume);
    };
    audio.addEventListener("volumechange", onVolumeChange);

    const updatePositionState = () => {
      if (
        "mediaSession" in navigator &&
        "setPositionState" in navigator.mediaSession
      ) {
        if (!audio.duration || Number.isNaN(audio.duration)) return;
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          position: audio.currentTime,
        });
      }
    };

    audio.addEventListener("timeupdate", updatePositionState);
    audio.addEventListener("durationchange", updatePositionState);
    audio.addEventListener("ratechange", updatePositionState);

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", togglePlayPause);
      navigator.mediaSession.setActionHandler("pause", togglePlayPause);
      navigator.mediaSession.setActionHandler(
        "previoustrack",
        selectPreviousPlaylistItem,
      );
      navigator.mediaSession.setActionHandler(
        "nexttrack",
        selectNextPlaylistItem,
      );

      try {
        navigator.mediaSession.setActionHandler("seekbackward", (details) => {
          const skipTime = details.seekOffset || 10;
          audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
          updatePositionState();
        });
        navigator.mediaSession.setActionHandler("seekforward", (details) => {
          const skipTime = details.seekOffset || 10;
          audio.currentTime = Math.min(
            audio.currentTime + skipTime,
            audio.duration,
          );
          updatePositionState();
        });
        navigator.mediaSession.setActionHandler("seekto", (details) => {
          if (details.fastSeek && "fastSeek" in audio) {
            audio.fastSeek(details.seekTime);
            return;
          }
          audio.currentTime = details.seekTime;
          updatePositionState();
        });
      } catch {
        /* some browsers might not support all actions */
      }
    }

    return () => {
      audio.removeEventListener("ended", selectNextPlaylistItem);
      audio.removeEventListener("volumechange", onVolumeChange);
      audio.removeEventListener("timeupdate", updatePositionState);
      audio.removeEventListener("durationchange", updatePositionState);
      audio.removeEventListener("ratechange", updatePositionState);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Restore volume
    if (Math.abs(audio.volume - volume) > 0.01) {
      audio.volume = volume;
    }

    if (!url) {
      audio.src = "";
      audio.pause();
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "none";
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
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "playing";
        navigator.mediaSession.metadata = new window.MediaMetadata({
          album: "amp-media-player",
          artist: "amp-media-player",
          title: toTitle(url),
        });
      }
    } else {
      audio.pause();
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
    }
  }, [isPlaying, url, volume]);

  return (
    <div className="player">
      <audio ref={audioRef} className="player__media" controls preload="">
        Sorry, this media format is not supported.
      </audio>
      {url && (
        <div className="player__title">
          {toTitle(url)}
          <button
            className="player__clear-button"
            onClick={resetPlayer}
            title="Clear"
            type="button"
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
};
