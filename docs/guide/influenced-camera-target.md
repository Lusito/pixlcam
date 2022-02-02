# Influenced Camera Target

Read about the [InfluencedCamera](./influenced-camera.md) first.

An [InfluencedCameraTarget](../api/interfaces/InfluencedCameraTarget.md) needs to implement the following properties:

## Position and Zoom

The `x` and `y` properties represent the target position in your world. Keep them up to date.

The `zoom` value will be combined with the camera zoom and the cue zoom values to form the final zoom value.

## Aim Influences

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
```
