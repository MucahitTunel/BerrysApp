#! /bin/bash
set -e # see: https://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin

DEV=0
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NO_COLOR='\033[0m'

APP_ENV="staging"
APP_OS="ios and android"
DEPLOY_TYPE="hard"

success(){
  echo -e "✅  ${GREEN}$1${NO_COLOR}"
}

warn(){
  echo -e "⚠️  ${YELLOW}$1${NO_COLOR}"
  if [ $DEV -eq 0 ]
  then
    exit 1
  fi
}

check_environment(){
  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

  if [ "$CURRENT_BRANCH" != "$REPO_GIT_BRANCH" ]
  then
    warn "Wrong branch, checkout $REPO_GIT_BRANCH to deploy to $APP_ENV."
  else
    success "Deploying to $APP_ENV."
  fi
}


while getopts ":e:o:t:d:" opt; do
  case $opt in
    e) APP_ENV="$OPTARG"
    ;;
    o) APP_OS="$OPTARG"
    ;;
    t) DEPLOY_TYPE="$OPTARG"
    ;;
    d) DEV=1
    ;;
    \?) echo "${RED}Invalid option -$OPTARG${NO_COLOR}" >&2
    ;;
  esac
done

# [[ -z $(git status -s) ]] || warn 'Please make sure you deploy with no changes or untracked files. You can run *git stash --include-untracked*.'

source fastlane/.env.$APP_ENV

# check_environment $APP_ENV

if [ $DEPLOY_TYPE == "hard" ]; then
  echo -e "${BLUE}* * * * *"
  echo -e "👷  Hard-Deploy"
  echo -e "* * * * *${NO_COLOR}"

  if [[ $APP_OS != "android" ]]; then
    echo -e "${GREEN}- - - - -"
    echo -e "Fastlane 🍎  iOS $APP_ENV"
    echo -e "- - - - -${NO_COLOR}"
    ENVFILE=fastlane/.env.${APP_ENV} bundle exec fastlane ios deploy --env $APP_ENV
  fi
  if [[ $APP_OS != "ios" ]]; then
    echo -e "${YELLOW}- - - - -"
    echo "Fastlane 🤖  Android $APP_ENV"
    echo -e "- - - - -${NO_COLOR}"
    ENVFILE=fastlane/.env.${APP_ENV} bundle exec fastlane android deploy --env $APP_ENV
  fi
fi

success "📦  Deploy succeeded."
