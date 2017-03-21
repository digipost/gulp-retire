# gulp-retire

A simple gulp plugin for running retire. Runs the executable directly and looks at the result.

## Usage

We might want to publish this to npm one day, but that'd require some more cleaning and testing. For now, you have to add it as a npm/yarn git dependency:

```
yarn add --dev git://github.com/digipost/gulp-retire#version
```

```
npm install --save --only=dev git://github.com/digipost/gulp-retire#version

```

## Releasing

Releases are created using [release-it](https://www.npmjs.com/package/release-it). Run as follows:
 
```
npm run release -- <increment> [options]
```

Note the double dashes `--`, which are used to instruct npm to pass the arguments to release-it instead of parsing them itself.

The `--dry-run` option is especially useful if you want to check what a release does.