APP_ENV="dev"

while getopts ":e:" opt; do
  case $opt in
    e) APP_ENV="$OPTARG"
    ;;
    \?) echo "${RED}Invalid option -$OPTARG${NO_COLOR}" >&2
    ;;
  esac
done

source fastlane/.env.$APP_ENV

bundle exec fastlane ios certificates --env $APP_ENV
