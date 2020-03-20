module.exports = api => {
  api.cache.never()
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            components: './src/components',
            features: './src/features',
            state: './src/state',
            storybook: './src/storybook',
          },
        },
      ],
    ],
  }
}
