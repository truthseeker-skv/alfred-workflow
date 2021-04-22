const path = require('path');
const { copySync } = require('fs-extra');

const fromDir = path.resolve(__dirname, '../src/icons/png');
const toDir = path.resolve(__dirname, '../lib/icons/png');

copySync(fromDir, toDir);
