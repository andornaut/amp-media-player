import "./style.css";
import {
  dequeueIndex,
  resetPlaylist,
  selectIndex,
} from "../../actions/playlist";
import { toFilename } from "../../transform";

const Item = ({ currentIndex, index, url }) => {
  const cssClass = `playlist__item${index === currentIndex ? " playlist__item--active" : ""}`;
  const filename = toFilename(url);

  const onClickPlay = (event) => {
    event.preventDefault();
    selectIndex(index);
  };

  const onClickRemove = (event) => {
    event.preventDefault();
    dequeueIndex(index);
  };

  return (
    <span className={cssClass}>
      <a
        href={url}
        className="playlist__play"
        onClick={onClickPlay}
        title="Play"
      >
        {filename}
      </a>
      <button
        className="playlist__remove-button"
        type="button"
        onClick={onClickRemove}
        title="Remove from playlist"
      >
        ✖
      </button>
    </span>
  );
};

export const Playlist = ({ state }) => {
  const { index, items } = state.playlist || { index: 0, items: [] };

  return (
    <div className="playlist">
      {items.length > 0 && (
        <button
          className="playlist__clear-button"
          type="button"
          onClick={resetPlaylist}
        >
          Clear playlist
        </button>
      )}
      <div className="playlist__list">
        {items.map((url, i) => (
          <Item key={`${url}-${i}`} url={url} index={i} currentIndex={index} />
        ))}
      </div>
    </div>
  );
};
