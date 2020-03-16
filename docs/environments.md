# Environments

Typically we have 3 environments:
- `dev` (for developers)
- `staging` (for testers)
- `production` (for real users)

The corresponding environment variables are stored in these files (in `fastlane` directory):
- `.env.dev`
- `.env.staging`
- `.env.production`

### Usage
- in JavaScript:
```javascript
import Config from 'react-native-config'
console.log(Config.ENV_VARIABLE)
```
- in native Android/iOS code: see [native usage](https://github.com/luggit/react-native-config#native-usage)


 


