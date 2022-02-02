# Influenced Camera Cue

Read about the [InfluencedCamera](./influenced-camera.md) first.

An [InfluencedCameraCue](../api/interfaces/InfluencedCameraCue.md) needs to implement the following properties:

## Position and Zoom

The `x` and `y` properties represent the cue position in your world. Keep them up to date.

The `zoom` value will be combined with the camera zoom and the target zoom value to form the final zoom value.

## Inner and Outer Radius

When the camera target moves into the `outerRadius` of a cue, the cue starts attracting the camera. The closer it gets to the `innerRadius`, the more stronger the influence. Within the `innerRadius`, the cue has full control and the camera is fixed on the position of the cue.

If two (or more) cues overlap, they will all attract the camera.
