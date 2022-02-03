# Basic Camera

All cameras in this library extend the [Camera](../api/classes/Camera.md) class.

Most of the following applies to all camera classes, but some might differ a bit.

## Camera Matrices

All cameras provide a `projection` and a `modelView` property, which are 4x4 matrices (an array of 16 numbers). These are ready to use on WebGL shaders.

## Setting the Viewport

In order to have the correct projection matrix, you'll need to set the viewport size at least once on initialization by calling `resize(width, height)` on the camera.

If your viewport changes, for example on browser resize or orientation change, be sure to call `camera.resize` when that happens as well!

## Pixel Snapping

All cameras by default snap to pixels in order to avoid sub-pixel positioning. You can disable this behavior by setting The `snapToPixel` property on the camera to false.

## Zoom Level

You can set the zoom level of all cameras except the ScreenCamera. Do this by calling `setZoom(value)` on the camera. Default is 1.

## Positioning the Camera

You can use the [moveTo](../api/classes/Camera.md#moveto) method to set the desired position of the camera.

## Setting Boundaries

In some scenarios, you might want to constrain the camera to stay within the specified bounds. For example to not show anything outside the level geometry. You can use [setBounds](../api/classes/Camera.md#setbounds) to do that. Use `setBounds(null)` to remove the boundary.
