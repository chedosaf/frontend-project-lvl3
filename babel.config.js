module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            ' > 5%',
            'not dead',
          ],
        },
      },
    ],
  ],
};
