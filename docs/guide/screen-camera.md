# Screen Camera

The [ScreenCamera](../api/classes/ScreenCamera.md) is by far the most simple camera in this library.

You essentially only need to make sure you call [resize](../api/classes/ScreenCamera.md#resize) to configure the viewport.

Calling [setZoom](../api/classes/ScreenCamera.md#setzoom) or [setBounds](../api/classes/ScreenCamera.md#setbounds) don't really make sense to use.

Calling [moveTo](../api/classes/ScreenCamera.md#moveto) is not required, as it's centered automatically on resize. It's still allowed though in case you want to implement some kind of screen-shaking effect maybe.
