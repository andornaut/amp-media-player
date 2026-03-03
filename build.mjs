import * as esbuild from 'esbuild';
import { cpSync, rmSync } from 'fs';

const isProduction = process.argv.includes('--production');
const isWatch = process.argv.includes('--watch');

const log = (msg) => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);

const copyStatic = () => {
  cpSync('index.html', 'dist/index.html');
  cpSync('static', 'dist/static', { recursive: true });
};

const buildOptions = {
  bundle: true,
  entryPoints: [
    { in: 'src/index.js', out: 'main' },
    {
      in: 'node_modules/http-basic-auth-proxy-worker/worker.js',
      out: 'worker',
    },
  ],
  format: 'iife',
  minify: isProduction,
  outdir: 'dist',
  loader: { '.js': 'jsx' },
  jsx: 'automatic',
  plugins: isWatch
    ? [
      {
        name: 'log',
        setup: (b) =>
          b.onEnd((r) =>
            log(r.errors.length ? 'Build failed' : 'Build complete')),
      },
    ]
    : [],
  sourcemap: !isProduction,
};

rmSync('dist', { force: true, recursive: true });
copyStatic();

const ctx = await esbuild.context(buildOptions);
if (isWatch) {
  await ctx.watch();
  await ctx.serve({ host: '0.0.0.0', port: 8080, servedir: 'dist' });
  log('Serving at http://localhost:8080');
} else {
  await ctx.rebuild();
  await ctx.dispose();
  log(`Build complete (${isProduction ? 'production' : 'development'})`);
}
