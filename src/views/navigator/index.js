import { useRef, useEffect } from 'react';

import {
  enqueueFilteredFiles,
  navigate,
  navigateForward,
  debouncedSetFilter,
  disableFocusTrigger,
} from '../../actions/navigator';
import { enqueue } from '../../actions/playlist';
import { isFile } from '../../helpers';
import { toFilename } from '../../transform';
import './style.css';

const onClickAnchor = (action) => (event) => {
  event.preventDefault();
  action(event.currentTarget.href);
};

const onInputSearchFilter = (event) => {
  debouncedSetFilter(event.target.value);
};

const onSubmit = (event) => {
  event.preventDefault();
  navigateForward();
};

const Item = ({ url, current }) => {
  const action = isFile(url) ? enqueue : navigate;
  const cssClass = `navigator__item${url === current ? ' navigator__item--active' : ''}`;
  return (
    <a className={cssClass} href={url} onClick={onClickAnchor(action)}>
      {toFilename(url)}
    </a>
  );
};

export const Navigator = ({ state }) => {
  const navigatorState = state.navigator || {};
  const {
    current,
    filter,
    filteredFiles = [],
    filteredItems = [],
    items = [],
    isLoading,
    error,
    shouldTriggerFocus,
  } = navigatorState;

  const inputRef = useRef(null);

  useEffect(() => {
    if (shouldTriggerFocus && inputRef.current) {
      inputRef.current.focus();
      disableFocusTrigger();
    }
  }, [shouldTriggerFocus]);

  if (error) {
    return (
      <div className="navigator__status navigator__status--error" role="alert">
        {error}
      </div>
    );
  }

  if (isLoading && !items.length) {
    return (
      <div className="navigator__status navigator__status--loading">
        Loading...
      </div>
    );
  }

  if (!isLoading && !items.length) {
    return <div className="navigator__status">No files found.</div>;
  }

  return (
    <div className="navigator">
      {items.length > 0 && (
        <form
          className="navigator__search-form"
          name="search"
          onSubmit={onSubmit}
        >
          <input
            ref={inputRef}
            className="navigator__search-input input"
            onInput={onInputSearchFilter}
            type="search"
            defaultValue={filter}
            aria-label="Search files"
          />
        </form>
      )}
      {filteredFiles.length > 0 && (
        <button
          className="navigator__add-all-button"
          type="button"
          onClick={enqueueFilteredFiles}
        >
          Add all files
        </button>
      )}
      <div className="navigator__list">
        {filteredItems.map((url) => (
          <Item key={url} url={url} current={current} />
        ))}
      </div>
    </div>
  );
};
