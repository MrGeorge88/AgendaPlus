import { build } from 'esbuild';
import { resolve } from 'path';

// Configuración para ESBuild
build({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'dist/bundle.js',
  format: 'esm',
  target: ['es2020'],
  external: [],
  loader: {
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.gif': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
    '.eot': 'file',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  plugins: [
    // Asegurarse de que sonner se incluya correctamente
    {
      name: 'ensure-sonner',
      setup(build) {
        build.onResolve({ filter: /^sonner$/ }, args => {
          return {
            path: resolve('./node_modules/sonner/dist/index.mjs'),
            namespace: 'sonner',
          };
        });
      },
    },
  ],
}).catch(() => process.exit(1));
