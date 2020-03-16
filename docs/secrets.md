# Secrets

In each [environment](./environments.md), some files are considered as "secrets", for example:
- Android keystore files
- Firebase's google-services.json / GoogleService-Info.plist files

## Workflow
The following are example of workflows for secrets in `dev` environment:
#### To fetch all secrets
- "unpack" all secrets: `yarn unpack-secrets -e dev`
- enter the password (default: `dsv123!@#`)
- all secrets will be unpacked to the correct location

#### To add a new secret/update an existing secret (e.g `MY_SECRET_FILE`)
- make sure you've fetched all current secrets
- ignore the file in `.gitignore`
- add the path of file to `SECRETS_TO_PACK` list (separate by a space) in `scripts/pack-secrets.sh`
- "pack" all secrets: `yarn pack-secrets -e dev`
- enter the password
- secrets will be packed into a `.tar.gz.gpg` file 
- add & commit the newly generated GPG file to the repo
