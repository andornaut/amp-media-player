# AMP Media Player

AMP Media Player is a lightweight web-app that enables you to stream music from
[web server directory indexes](https://en.wikipedia.org/wiki/Webserver_directory_index).

![AMP Media Player screenshot](./screenshot.png)

## How it works

1. Point AMP to a web server that serves a directory index (e.g. Apache or Nginx)
1. If the server requires authentication, then AMP will use a
   [service worker](https://github.com/andornaut/http-basic-auth-proxy-worker)
   to proxy requests with the necessary credentials
1. Navigate your music collection and stream audio directly in your browser

n.b. Your web server must be configured to
[support CORS requests](https://github.com/andornaut/http-basic-auth-proxy-worker#web-server)
if AMP is hosted on a different domain!

## Developing

### Getting Started

1. Install [node](https://nodejs.org/en/) (see [`.nvmrc`](.nvmrc) for the recommended version)
1. `npm install`
1. `npm run watch` and open [http://localhost:8080](http://localhost:8080)

### Scripts

```bash
npm run build        # Development build (with sourcemaps)
npm run build:prod   # Production build (minified, no sourcemaps)
npm run watch        # Build + dev server on :8080 with live rebuild
npm run lint         # ESLint (zero warnings tolerance)
npm run lint:fix     # ESLint with auto-fix
npm run format       # Format all source files with prettier-eslint
```

## Publishing

Tagged releases (`v*`) automatically produce a packaged zip file via
[GitHub Actions](.github/workflows/ci.yml). To create a release:

1. Update the version in `package.json`
2. Commit the version bump
3. Tag and push:

```bash
git tag v0.x.x
git push && git push --tags
```

The latest build from the `main` branch is also always available as a
[rolling release](https://github.com/andornaut/amp-media-player/releases/tag/main).

## Credits

- [jetstart](https://github.com/andornaut/jetstart) (UI framework)
- [http-basic-auth-proxy-worker](https://github.com/andornaut/http-basic-auth-proxy-worker) (auth proxy)
- [dimpl](https://github.com/andornaut/dimpl) (the predecessor)
