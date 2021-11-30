module.exports = {
  '**/*.{js,jsx,ts,tsx}': filenames =>
    `next lint --file ${filenames
      .map(file => file.split(process.cwd())[1])
      .join(' --file ')}`,
};
