# Camera2D

[![Minified + gzipped size](https://badgen.net/bundlephobia/minzip/camera2d)](https://www.npmjs.com/package/camera2d)
[![NPM version](https://badgen.net/npm/v/camera2d)](https://www.npmjs.com/package/camera2d)
[![License](https://badgen.net/github/license/lusito/camera2d)](https://github.com/lusito/camera2d/blob/master/LICENSE)
[![Stars](https://badgen.net/github/stars/lusito/camera2d)](https://github.com/lusito/camera2d)
[![Watchers](https://badgen.net/github/watchers/lusito/camera2d)](https://github.com/lusito/camera2d)

A set of 2D cameras for games written in TypeScript:

- A [simple camera](https://lusito.github.io/camera2d/api/classes/ScreenCamera.md) for drawing in screen-space
- A [camera that follows](https://lusito.github.io/camera2d/api/classes/FollowingCamera.md) your player smoothly
- An [influenced camera](https://lusito.github.io/camera2d/api/classes/InfluencedCamera.md) inspired by the [camera from Insanely Twisted Shadow Planet](http://michelgagne.blogspot.com/2012/07/itsp-camera-explained.html).

You'll get a projection and a model-view matrix ready to use, but there are also getters if your setup can't specify a camera matrix.

#### Fair Warning
The compile target of this library is es2015, so if you want to support older browsers, you'll have to ensure that this module is being transpiled to an older es version during your build-process.

### Get started

* [Read the documentation](https://lusito.github.io/camera2d/)
* Look at the example (`example/*.ts`).
* Ask questions if the above doesn't clarify something good enough.

### Report issues

Something not working quite as expected? Do you need a feature that has not been implemented yet? Check the [issue tracker](https://github.com/Lusito/camera2d/issues) and add a new one if your problem is not already listed. Please try to provide a detailed description of your problem, including the steps to reproduce it.

### Contribute

Awesome! If you would like to contribute with a new feature or submit a bugfix, fork this repo and send a pull request. Please, make sure all the unit tests are passing before submitting and add new ones in case you introduced new features.

### License

**Camera2D** is licensed under the [zlib/libpng](https://github.com/Lusito/camera2d/blob/master/LICENSE), meaning you
can use it free of charge, without strings attached in commercial and non-commercial projects. Credits are appreciated but not mandatory.
