########################################################################################
# Zip secrets archive, from the root of the project. Saves the location of the secrets #
# for later unzipping.                                                                 #
# Command: ./scripts/pack-secrets.sh -e <environment>                                  #
########################################################################################

#! /bin/bash
set -e

## Use to create the secrets archive by grabbing all the secret files from your current codebase.
## Useful to add/remove secrets from the archive, after having unpacked currently comited archive with unpack_secrets.sh.

APP_ENV=""
GREEN='\033[0;32m'

while getopts ":e:" opt; do
  case $opt in
    e) APP_ENV="$OPTARG"
    ;;
    \?) echo "${RED}Invalid option -$OPTARG${NO_COLOR}" >&2
    ;;
  esac
done

source fastlane/.env.${APP_ENV}

FILE_ROOT="__secrets__/app_secrets_with_paths_${APP_ENV}"

# Select files to put in the archive
SECRETS_TO_PACK="fastlane/.env.${APP_ENV} android/app/${GRADLE_KEYSTORE} ios/${IOS_PROJECT_NAME}/${IOS_GOOGLE_PLIST_FILE} android/app/${ANDROID_GOOGLE_SERVICES_FILE}"

# Create archive
tar -cvzf $FILE_ROOT.tar.gz $SECRETS_TO_PACK

# Encrypt archive
gpg --symmetric $FILE_ROOT.tar.gz

## Remove intermediaries
rm $FILE_ROOT.tar.gz

echo -e "✅ ${GREEN} ${APP_ENV} secrets have been packed into ${FILE_ROOT}.tar.gz.gpg. Please commit this encrypted archive."
