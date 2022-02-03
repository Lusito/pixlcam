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

## Setting a Camera Target

A target is the main focus of the camera until something attracts the cameras attention. The target is usually the player, but it can be something else as well. Without a target, the camera won't do anything.

To set the target, call [setTarget](../api/classes/InfluencedCamera.md#settarget). You only need to call it again if the target changes. Property changes will be automatically detected. When you switch from one target to another, a transition will be performed, so that the camera does not instantly jump to the new target.

An [InfluencedCameraTarget](../api/interfaces/InfluencedCameraTarget.md) needs to implement the following properties:

### Position and Zoom

The `x` and `y` properties represent the target position in your world. Keep them up to date.

The `zoom` value will be combined with the camera zoom and the cue zoom values to form the final zoom value.

### Aim Influences

The `aims` property is a list of [AimInfluence](../api/classes/AimInfluence.md) instances.

Think of an aim influence as an offset vector relative to the target, attracting the camera.

Example use-cases:
- Looking ahead of the player (use the players velocity vector).
- Looking where the player aims (use the direction vector).

You can change the offset using the [set](../api/classes/AimInfluence.md#set) method.

You can configure the following settings on an AimInfluence via constructor parameter and also later via the respective public property.

```typescript
    /** The maximum length this influence offset can have. */
    public maxLength: number;
    /** The factor to multiply the influence offset by (before applying maxLength). Defaults to 1. */
    public factor: number;
    /** The percentage amount to move with each update. A value between 0 and 1. */
    public lerpFactor: number;
    /** The number of frames to remember to smoothen the camera movement. Defaults to 30. */
    averageMaxFrames?: number;
```

## Adding and Removing Cues

In addition to aim influences, which are relative to the target, we also have cues, which are positioned absolutely in the world.
Cues attract the camera away from the target and affect both position and zoom level of the camera. The closer you get to a cue, the more it takes control of the camera.

To add a cue, call [addCue](../api/classes/InfluencedCamera.md#addcue) and to remove it, call [removeCue](../api/classes/InfluencedCamera.md#removecue) or [removeAllCues](../api/classes/InfluencedCamera.md#removeallcues) to remove all cues in one go.

When removing a cue, you can specify a `fadeTime`. If you do that, the cue will be cloned internally and gradually lose its influence on the camera, so the camera doesn't jump when it's finally removed.

An [InfluencedCameraCue](../api/interfaces/InfluencedCameraCue.md) needs to implement the following properties:

### Position and Zoom

The `x` and `y` properties represent the cue position in your world. Keep them up to date.

The `zoom` value will be combined with the camera zoom and the target zoom value to form the final zoom value.

### Inner and Outer Radius

When the camera target moves into the `outerRadius` of a cue, the cue starts attracting the camera. The closer it gets to the `innerRadius`, the more stronger the influence. Within the `innerRadius`, the cue has full control and the camera is fixed on the position of the cue.

If two (or more) cues overlap, they will all attract the camera.
