import { useStatezero } from 'statezero-react-hooks';

import { navigate } from '../../actions/navigator';
import { toTitle } from '../../transform';
import './style.css';

const ROOT_SHORTCUT = 'Shortcut: ctrl + b';
const UP_SHORTCUT = 'Shortcut: b or backspace';

const onClick = (event) => {
  event.preventDefault();
  const { href } = event.currentTarget;
  navigate(href);
};

const Breadcrumb = ({
  className, label, title, url,
}) => (
  <a
    className={`breadcrumbs__item ${className}`}
    href={url}
    onClick={onClick}
    title={title}
  >
    {label}
  </a>
);

export const Breadcrumbs = () => {
  const [root, ...others] = useStatezero(
    (state) => state.navigator.breadcrumbs || [],
  );
  const baseUrl = useStatezero((state) => state.config.proxy.baseUrl);

  if (!root) return null;

  return (
    <div className="breadcrumbs">
      <Breadcrumb
        className="breadcrumbs__item--root"
        label={baseUrl}
        title={ROOT_SHORTCUT}
        url={root}
      />
      {others.map((url) => (
        <Breadcrumb
          key={url}
          className="breadcrumbs__item--subdir"
          label={toTitle(url)}
          title={UP_SHORTCUT}
          url={url}
        />
      ))}
    </div>
  );
};
