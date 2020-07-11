module.exports = (api) => {
  api.cache.never()
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      'babel-plugin-styled-components',
      [
        'module-resolver',
        {
          alias: {
            assets: './src/assets',
            components: './src/components',
            constants: './src/constants',
            features: './src/features',
            services: './src/services',
            state: './src/state',
            storybook: './src/storybook',
            theme: './src/theme',
          },
        },
      ],
    ],
  }
}
