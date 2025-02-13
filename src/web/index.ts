import { readFileSync, writeFileSync } from 'fs';

import { merge } from 'lodash';
import { run } from 'shell-commands';

import misc from './misc';
import source from './source';

export const web = async () => {
  await run(`
    yarn add --dev antd react react-dom manate @types/react-dom parcel gh-pages
  `);
  const pkgJson = {
    scripts: {
      serve:
        'rm -rf .parcel-cache temp && parcel src/index.html --dist-dir temp',
      release:
        'rm -rf .parcel-cache && parcel build src/index.html --dist-dir docs --public-url ./ && gh-pages -d docs && rm -rf docs',
    },
  };
  const originalPkg = JSON.parse(readFileSync('package.json', 'utf-8'));
  delete originalPkg.scripts.test;
  delete originalPkg.scripts.demo;
  writeFileSync(
    'package.json',
    JSON.stringify(merge(pkgJson, originalPkg), null, 2),
  );

  for (const step of [misc, source]) {
    step();
  }
};
