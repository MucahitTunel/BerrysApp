# Getting Started

Here's the list of what you should do to setup a new project base on this boilerplate:

### Unpack the default env files
```
yarn unpack-secrets -e dev
yarn unpack-secrets -e staging
yarn unpack-secrets -e production
```

### App identifier (App ID)
- Select an app ID

It is recommended that you have the same app ID for iOS and Android apps. Usually the app ID follows this reverse domain convention: `domain.companyName.app`.

For example, your **production** app ID can be `com.tinder.app`. The other app IDs for other environments will be: `com.tinder.app.dev` (**dev** environment), `com.tinder.app.staging` (**staging** environment)

- Replace the default app ID with the selected one. On Android, package name is not necessary identical to app ID. In the case above, `com.tinder.app` can be the package name while `com.tinder.app.dev`, `com.tinder.app.staging` or `com.tinder.app` can be app IDs.

  - Replace all instances of `com.reactnativeboilerplate` with your selected app ID, for example `com.tinder.app`
  - Create the corresponding directory structure base on your Android package name in `android/app/src/main/java`, for example `com/tinder/app`  

### Project name
Replace all instances of `ReactNativeBoilerplate` with your project name, for example `TinderMobile`.

### Update app icons
- // TODO use [fastlane-plugin-badge](https://github.com/HazAT/fastlane-plugin-badge) 

### Setup AppCenter apps (staging)
- Common
  - Create a new Organization on AppCenter: https://appcenter.ms/orgs/create
  - Go to `https://appcenter.ms/orgs/{your_org}/applications/create`, create an iOS app (e.g `tinder-mobile-staging-ios`) and an Android app (e.g `tinder-mobile-staging-android`)
  - Copy the app names, app secrets and update them to `.env.staging` file
  - Generate a new API token: https://appcenter.ms/settings/apitokens and update `APPCENTER_API_TOKEN` in `.env.staging` file 
- iOS
  - Create iOS app identifier on Apple Developer Portal: `bundle exec fastlane produce -u {your_apple_dev_id} -a com.tinder.app.staging --skip_itc true`
  - Create a repository for storing Apple certificates/provisioning profiles. Update `IOS_MATCH_GIT_URL`, `IOS_MATCH_TEAM_ID`, `IOS_MATCH_TEAM_NAME`, `IOS_MATCH_USERNAME` in `.env.staging` file
  - Generate certificates/provisioning profiles: `yarn match -e staging`
  - Start deploying: `yarn deploy -t hard -e staging -o ios`
- Android
  - Create the staging keystore file: `keytool -genkey -v -keystore TinderMobile.staging.keystore -storepass {your_keystore_password} -alias TinderMobile -keypass {your_alias_password} -keyalg RSA -keysize 2048 -validity 10000`
  - Move the staging keystore file to `android/app/` directory
  - Update `GRADLE_KEYSTORE`, `GRADLE_KEYSTORE_PASSWORD`, `GRADLE_KEYSTORE_ALIAS`, `GRADLE_KEYSTORE_ALIAS_PASSWORD` in `.env.staging` file
  - Start deploying: `yarn deploy -t hard -e staging -o android`

### Setup Production apps
- // TODO
