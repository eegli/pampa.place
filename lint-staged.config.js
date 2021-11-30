module.exports = {
  '**/*.(ts|js)?(x)': filenames =>
    `next lint --file ${filenames
      .map(file => file.split(process.cwd())[1])
      .join(' --file ')}`,
};
