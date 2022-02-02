(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{348:function(e,a,t){"use strict";t.r(a);var r=t(26),s=Object(r.a)({},(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"getting-started"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#getting-started"}},[e._v("#")]),e._v(" Getting Started")]),e._v(" "),t("p",[e._v("The following shows you the basics that apply to every camera in this package.")]),e._v(" "),t("p",[e._v("All cameras extend the "),t("RouterLink",{attrs:{to:"/api/classes/Camera.html"}},[e._v("Camera")]),e._v(" class.")],1),e._v(" "),t("h2",{attrs:{id:"camera-matrices"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#camera-matrices"}},[e._v("#")]),e._v(" Camera Matrices")]),e._v(" "),t("p",[e._v("All cameras provide a "),t("code",[e._v("projection")]),e._v(" and a "),t("code",[e._v("modelView")]),e._v(" property, which are 4x4 matrices (an array of 16 numbers). These are ready to use on WebGL shaders.")]),e._v(" "),t("h2",{attrs:{id:"configuration-options"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#configuration-options"}},[e._v("#")]),e._v(" Configuration Options")]),e._v(" "),t("h3",{attrs:{id:"setting-the-viewport"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#setting-the-viewport"}},[e._v("#")]),e._v(" Setting the Viewport")]),e._v(" "),t("p",[e._v("In order to have the correct projection matrix, you'll need to set the viewport size at least once on initialization by calling "),t("code",[e._v("resize(width, height)")]),e._v(" on the camera.")]),e._v(" "),t("p",[e._v("If your viewport changes, for example on browser resize or orientation change, be sure to call "),t("code",[e._v("camera.resize")]),e._v(" when that happens as well!")]),e._v(" "),t("h3",{attrs:{id:"pixel-snapping"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#pixel-snapping"}},[e._v("#")]),e._v(" Pixel Snapping")]),e._v(" "),t("p",[e._v("All cameras by default snap to pixels in order to avoid sub-pixel positioning. You can disable this behavior by setting The "),t("code",[e._v("snapToPixel")]),e._v(" property on the camera to false.")]),e._v(" "),t("h3",{attrs:{id:"zoom-level"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#zoom-level"}},[e._v("#")]),e._v(" Zoom Level")]),e._v(" "),t("p",[e._v("You can set the zoom level of all cameras except the ScreenCamera. Do this by calling "),t("code",[e._v("setZoom(value)")]),e._v(" on the camera. Default is 1.")]),e._v(" "),t("h3",{attrs:{id:"positioning-the-camera"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#positioning-the-camera"}},[e._v("#")]),e._v(" Positioning the Camera")]),e._v(" "),t("p",[e._v("Positioning the camera is different for each camera.\nThere is a "),t("code",[e._v("moveTo")]),e._v(" method on the base Camera class, but I'm not sure if this is supposed to stay here, since it doesn't make sense for any camera aside of FollowingCamera.")])])}),[],!1,null,null,null);a.default=s.exports}}]);