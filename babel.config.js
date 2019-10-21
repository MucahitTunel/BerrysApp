module.exports = api => {
  api.cache.never()
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            navigation: './src/navigation',
            screens: './src/screens',
          },
        },
      ],
    ],
  }
}
