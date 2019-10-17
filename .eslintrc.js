module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  plugins: ['import'],
  rules: {
    'no-await-in-loop': 2,
    'import/no-unresolved': 'off',
  },
  settings: {
    "import/resolver": {
      "babel-module": {}
    }
  },  
}
