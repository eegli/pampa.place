module.exports = {
  '**/*.(ts|js)?(x)': filenames =>
    `eslint ${filenames.map(file => file.split(process.cwd())[1]).join(' ')}`,
};
