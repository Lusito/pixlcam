# Following Camera

The [FollowingCamera](../api/classes/FollowingCamera.md) follows a target smoothly.

This camera is still a bit experimental, as the configuration options I created don't work as I planned, but it still has a nice motion. You might want to check out the [InfluencedCamera](./influenced-camera.md) if you are looking for a more polished camera.

## Updating the Camera

Since this camera needs to do work each frame, you'll need to call its [update](../api/classes/FollowingCamera.md#update) method with the time that passed since the last frame.

## Configuration Options

### Positioning the Camera

You can use the [moveTo](../api/classes/FollowingCamera.md#moveto) method to set the desired position of the camera. This will not move the camera instantly, so it takes time until it arrives at the destination.

If you need to move it instantly, call [moveInstantly](../api/classes/FollowingCamera.md#moveinstantly) after calling `moveTo`.

### Setting Boundaries

In some scenarios, you might want to constrain the camera to stay within the specified bounds. For example to now show anything outside the level geometry. You can use [setBounds](../api/classes/FollowingCamera.md#moveomstantly) to do that. Use `setBounds(null)` to remove the boundary.

### Other Options

The following properties on the camera object allow changing the behavior of the camera. As said in the beginning, this camera is experimental, so this doesn't behave exactly as you might expect from the names, so play around with them a bit.

```typescript
    public maxSpeed = 900;
    public acceleration = 20;
    public slowDistance = 100;
    public lockDistance = 1;
```
