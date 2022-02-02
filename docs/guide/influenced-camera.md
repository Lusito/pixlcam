# Influenced Camera

The [InfluencedCamera](../api/classes/InfluencedCamera.md) is the most advanced camera of this library and is inspired by the [camera from Insanely Twisted Shadow Planet](http://michelgagne.blogspot.com/2012/07/itsp-camera-explained.html).

This camera allows you to:
- Configure a target
  - A target has a a position, zoom and optionally aim influences.
  - An aim influence can be used to move the camera in the direction the player is moving and/or aiming.
  - You can switch targets to focus on something different, for example a cinematic event or a missile to be controlled for a short time.
- Set up visual cues in the world, which attract the camera (both in position and zoom)
- Configure world boundaries.

## Updating the Camera

Since this camera needs to do work each frame, you'll need to call its [update](../api/classes/InfluencedCamera.md#update) method with the time that passed since the last frame.

## Configuration Options

### Setting a Camera Target

A target is the main focus of the camera until something attracts the cameras attention. The target is usually the player, but it can be something else as well. Without a target, the camera won't do anything.

To set the target, call [setTarget](../api/classes/InfluencedCamera.md#settarget).

FIXME: move this to new file and add more explanation on aims and zoom.

An [InfluencedCameraTarget](../api/interfaces/InfluencedCameraTarget.md] needs to implement the following properties:

```typescript
    x: number;
    y: number;
    aims: AimInfluence[];
    zoom: number;
```

You only need to call `setTarget` if the target changes. Property changes will be automatically detected.

When you switch from one target to another, a transition will be performed, so that the camera does not instantly jump to the new target.

### Adding and Removing Cues

Cues attract the camera away from the target and might both change position and zoom level. The closer you get to a cue, the more it takes control of the camera.

To add a cue, call [addCue](../api/classes/InfluencedCamera.md#addcue) and to remove it, call [removeCue](../api/classes/InfluencedCamera.md#removecue). You can also call [removeAllCues](../api/classes/InfluencedCamera.md#removeallcues) to remove all cues in one go.

When removing a cue, you can specify a `fadeTime`. During the fade-time, the cue will gradually lose its influence on the camera, so the camera doesn't jump.

FIXME: Add page for CueInfluence

### Setting Boundaries

In some scenarios, you might want to constrain the camera to stay within the specified bounds. For example to not show anything outside the level geometry. You can use [setBounds](../api/classes/InfluencedCamera.md#moveomstantly) to do that. Use `setBounds(null)` to remove the boundary.
