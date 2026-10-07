import config from '@muneo/eslint-config/nextjs.js';

/** @type {import("eslint").Linter.Config[]} */
export default [...config, { ignores: ['.next-*/**'] }];
