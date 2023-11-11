import fs from 'fs-extra';
import path from 'path';

import esbuild, { minify } from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';

import { toHump } from './packages/utils'

const __dirname = path.resolve();

const { name: pkgName } = fs.readJSONSync(path.resolve('package.json'));

function genPackageConfig(name) {
  const input = `packages/${name}/index.ts`;

  return [
    {
      input,
      plugins: [esbuild()],
      output: [
        {
          file: `packages/${name}/dist/index.mjs`,
          format: 'es'
        },
        {
          file: `packages/${name}/dist/index.cjs`,
          format: 'cjs'
        },
        {
          file: `packages/${name}/dist/index.iife.js`,
          format: 'iife',
          name: toHump(`${pkgName}-${name}`),
          extend: true
        }
      ]
    },
    {
      input,
      plugins: [esbuild(), minify()],
      output: [
        {
          file: `packages/${name}/dist/index.min.iife.js`,
          format: 'iife',
          name: toHump(`${pkgName}-${name}`),
          extend: true
        }
      ]
    },
    {
      input,
      plugins: [dts()],
      output: [
        {
          file: `packages/${name}/dist/index.d.ts`
        }
      ]
    }
  ];
}

function genConfig() {
  const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));

  const config = packages.reduce((config, name) => {
    if (name.charAt(0) === '.') {
      return config;
    }
    return [...config, ...genPackageConfig(name)];
  }, []);

  return config;
}

export default genConfig();
