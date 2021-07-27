fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### set_build_numbers_to_current_timestamp
```
fastlane set_build_numbers_to_current_timestamp
```

### get_app_version
```
fastlane get_app_version
```


----

## iOS
### ios certificates
```
fastlane ios certificates
```

### ios build
```
fastlane ios build
```

### ios update_config
```
fastlane ios update_config
```

### ios deploy_to_appcenter
```
fastlane ios deploy_to_appcenter
```

### ios deploy_to_testflight
```
fastlane ios deploy_to_testflight
```

### ios deploy
```
fastlane ios deploy
```


----

## Android
### android update_config
```
fastlane android update_config
```

### android build
```
fastlane android build
```

### android deploy_to_appcenter
```
fastlane android deploy_to_appcenter
```

### android deploy_to_playstore
```
fastlane android deploy_to_playstore
```

### android deploy
```
fastlane android deploy
```


----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
