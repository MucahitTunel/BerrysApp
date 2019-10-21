module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  plugins: ['import'],
  rules: {
    'no-await-in-loop': 2,
    'import/no-unresolved': [2, { commonjs: true, amd: true }],
  },
  settings: {
    "import/resolver": {
      "babel-module": {
        alias: {
          navigation: './src/navigation',
          screens: './src/screens',
        },
        extensions: ['.js', '.native.js']
      },
    }
  },
}
