const path = require('path');

module.exports = {
  '{shared_resources,src}/**/*.{ts,tsx}': (files) => {
    const relativeFiles = files.map((file) => path.relative('.', file)).join(' ');
    return [
      `pnpm eslint --fix ${relativeFiles}`,
      `pnpm prettier --write ${relativeFiles}`
    ];
  },
  '{shared_resources,src}/**/*.{js,ts,jsx,tsx,json}': (files) => {
    const relativeFiles = files.map((file) => path.relative('.', file)).join(' ');
    return [
      `pnpm eslint --fix ${relativeFiles}`,
      `pnpm prettier --write ${relativeFiles}`
    ];
  },
};
