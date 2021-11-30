module.exports = {
  '**/*.(ts|js)?(x)': filenames => `eslint ${filenames.join(' ')}`,
};
