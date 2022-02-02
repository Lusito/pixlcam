# Influenced Camera

The [InfluencedCamera](../api/classes/InfluencedCamera.md) is the most advanced camera of this library and is inspired by the [camera from Insanely Twisted Shadow Planet](http://michelgagne.blogspot.com/2012/07/itsp-camera-explained.html).

This camera allows you to:
- Configure a target
  - A target has a a position, zoom and optionally aim influences.
  - An aim influence can be used to move the camera in the direction the player is moving and/or aiming.
  - You can switch targets to focus on something different, for example a cinematic event or a missile to be controlled for a short time.
- Set up visual cues in the world, which attract the camera (both in position and zoom)
- Configure world boundaries.

### TODO
