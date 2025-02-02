# default values
APP_ENV="dev"
APP_OS="ios"
IOS_DEVICE="iPhone 8"

while getopts ":e:o:d:" opt; do
  case $opt in
    e) APP_ENV="$OPTARG"
    ;;
    o) APP_OS="$OPTARG"
    ;;
    d) IOS_DEVICE="$OPTARG"
    ;;
    \?) echo "${RED}Invalid option -$OPTARG${NO_COLOR}" >&2
    ;;
  esac
done

source fastlane/.env.$APP_ENV

if [[ $APP_OS == "android" ]]; then
  bundle exec fastlane android update_config --env $APP_ENV && ENVFILE=fastlane/.env.${APP_ENV} npx react-native run-android --appId ${ANDROID_APP_ID}
fi

if [[ $APP_OS == "ios" ]]; then
  bundle exec fastlane ios update_config --env $APP_ENV && ENVFILE=fastlane/.env.${APP_ENV} npx react-native run-ios --simulator="${IOS_DEVICE}"
fi
