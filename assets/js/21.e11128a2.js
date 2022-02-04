(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{470:function(e,t,a){"use strict";a.r(t);var s=a(45),o=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"basic-camera"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#basic-camera"}},[e._v("#")]),e._v(" Basic Camera")]),e._v(" "),a("p",[e._v("All cameras in this library extend the "),a("RouterLink",{attrs:{to:"/api/classes/Camera.html"}},[e._v("Camera")]),e._v(" class.")],1),e._v(" "),a("p",[e._v("Most of the following applies to all camera classes, but some might differ a bit.")]),e._v(" "),a("h2",{attrs:{id:"camera-matrices"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#camera-matrices"}},[e._v("#")]),e._v(" Camera Matrices")]),e._v(" "),a("p",[e._v("All cameras provide a "),a("code",[e._v("projection")]),e._v(" and a "),a("code",[e._v("modelView")]),e._v(" property, which are 4x4 matrices (an array of 16 numbers). These are ready to use on WebGL shaders.")]),e._v(" "),a("h2",{attrs:{id:"setting-the-viewport"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#setting-the-viewport"}},[e._v("#")]),e._v(" Setting the Viewport")]),e._v(" "),a("p",[e._v("In order to have the correct projection matrix, you'll need to set the viewport size at least once on initialization by calling "),a("code",[e._v("resize(width, height)")]),e._v(" on the camera.")]),e._v(" "),a("p",[e._v("If your viewport changes, for example on browser resize or orientation change, be sure to call "),a("code",[e._v("camera.resize")]),e._v(" when that happens as well!")]),e._v(" "),a("h2",{attrs:{id:"pixel-snapping"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#pixel-snapping"}},[e._v("#")]),e._v(" Pixel Snapping")]),e._v(" "),a("p",[e._v("All cameras by default snap to pixels in order to avoid sub-pixel positioning. You can disable this behavior by setting The "),a("code",[e._v("snapToPixel")]),e._v(" property on the camera to false.")]),e._v(" "),a("h2",{attrs:{id:"zoom-level"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#zoom-level"}},[e._v("#")]),e._v(" Zoom Level")]),e._v(" "),a("p",[e._v("You can set the zoom level of all cameras except the ScreenCamera. Do this by calling "),a("code",[e._v("setZoom(value)")]),e._v(" on the camera. Default is 1.")]),e._v(" "),a("h2",{attrs:{id:"positioning-the-camera"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#positioning-the-camera"}},[e._v("#")]),e._v(" Positioning the Camera")]),e._v(" "),a("p",[e._v("You can use the "),a("RouterLink",{attrs:{to:"/api/classes/Camera.html#moveto"}},[e._v("moveTo")]),e._v(" method to set the desired position of the camera.")],1),e._v(" "),a("h2",{attrs:{id:"setting-boundaries"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#setting-boundaries"}},[e._v("#")]),e._v(" Setting Boundaries")]),e._v(" "),a("p",[e._v("In some scenarios, you might want to constrain the camera to stay within the specified bounds. For example to not show anything outside the level geometry. You can use "),a("RouterLink",{attrs:{to:"/api/classes/Camera.html#setbounds"}},[e._v("setBounds")]),e._v(" to do that. Use "),a("code",[e._v("setBounds(null)")]),e._v(" to remove the boundary.")],1)])}),[],!1,null,null,null);t.default=o.exports}}]);