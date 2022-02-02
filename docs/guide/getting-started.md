# Getting Started

The following shows you the basics that apply to every camera in this package.

All cameras extend the [Camera](../api/classes/Camera.md) class.

## Camera Matrices

All cameras provide a `projection` and a `modelView` property, which are 4x4 matrices (an array of 16 numbers). These are ready to use on WebGL shaders.

## Configuration Options

### Setting the Viewport

In order to have the correct projection matrix, you'll need to set the viewport size at least once on initialization by calling `resize(width, height)` on the camera.

If your viewport changes, for example on browser resize or orientation change, be sure to call `camera.resize` when that happens as well!

### Pixel Snapping

All cameras by default snap to pixels in order to avoid sub-pixel positioning. You can disable this behavior by setting The `snapToPixel` property on the camera to false.

### Zoom Level

You can set the zoom level of all cameras except the ScreenCamera. Do this by calling `setZoom(value)` on the camera. Default is 1.

### Positioning the Camera

Positioning the camera is different for each camera.
There is a `moveTo` method on the base Camera class, but I'm not sure if this is supposed to stay here, since it doesn't make sense for any camera aside of FollowingCamera.
