# ReactNativeBoilerplate

### Prerequisites

- [yarn](https://yarnpkg.com/en/)
- [bundler](https://bundler.io/)
- [gnupg](https://gnupg.org/download/)

### Installation

- `yarn`
- `bundle install`
- `cd ios && bundle exec pod install --repo-update`
- extract secrets for `dev` environment: `yarn unpack-secrets -e dev` (default password: `dsv123!@#`)

### Run
- ios: `yarn app -o ios`
- android: `yarn app -o android`

### Docs
- [Packages](./docs/packages.md)
