# PixlCam

[![Minified + gzipped size](https://badgen.net/bundlephobia/minzip/pixlcam)](https://www.npmjs.com/package/pixlcam)
[![NPM version](https://badgen.net/npm/v/pixlcam)](https://www.npmjs.com/package/pixlcam)
[![License](https://badgen.net/github/license/lusito/pixlcam)](https://github.com/lusito/pixlcam/blob/master/LICENSE)
[![Stars](https://badgen.net/github/stars/lusito/pixlcam)](https://github.com/lusito/pixlcam)
[![Watchers](https://badgen.net/github/watchers/lusito/pixlcam)](https://github.com/lusito/pixlcam)

A set of 2D cameras for games written in TypeScript:

- A [basic camera](https://lusito.github.io/pixlcam/basic-camera.html) you can use for simple stuff
- A [screen camera](https://lusito.github.io/pixlcam/screen-camera.html) for drawing in screen-space coordinates
- A [camera that follows](https://lusito.github.io/pixlcam/following-camera.html) your player smoothly
- An [influenced camera](https://lusito.github.io/pixlcam/influenced-camera.html) inspired by the [camera from Insanely Twisted Shadow Planet](http://michelgagne.blogspot.com/2012/07/itsp-camera-explained.html).

You'll get a projection and a model-view matrix ready to use, but there are also getters if your setup can't specify a camera matrix.

#### Fair Warning

The compile target of this library is es2015, so if you want to support older browsers, you'll have to ensure that this module is being transpiled to an older es version during your build-process.

### Get started

- [Read the documentation](https://lusito.github.io/pixlcam/)
- Look at the example (`example/*.ts`).
- Ask questions if the above doesn't clarify something good enough.

### Report issues

Something not working quite as expected? Do you need a feature that has not been implemented yet? Check the [issue tracker](https://github.com/Lusito/pixlcam/issues) and add a new one if your problem is not already listed. Please try to provide a detailed description of your problem, including the steps to reproduce it.

### Contribute

Awesome! If you would like to contribute with a new feature or submit a bugfix, fork this repo and send a pull request. Please, make sure all the unit tests are passing before submitting and add new ones in case you introduced new features.

### License

**PixlCam** is licensed under the [zlib/libpng](https://github.com/Lusito/pixlcam/blob/master/LICENSE), meaning you
can use it free of charge, without strings attached in commercial and non-commercial projects. Credits are appreciated but not mandatory.
