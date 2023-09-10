
var __bengkel__ = (!__bengkel__ ? {} : __bengkel__);
/**
 * License: MIT
 * 
 * + What
 * + --------------------------------------------------------------
 * Just library to create thumbnails of large image on browser.
 * 
 * The objective of this code is to create thumbnails of large
 * images with performance concern by redrawing and rescaling down
 * the loaded image using HTML Canvas [see link 1]. To fix strange-
 * looking results, we need - pixel-perfect downsampling - which 
 * can be found at stackoverflow [see link 2]. Since the code 
 * will be executed in the browser, the mechanism should be simple 
 * and not requires complicated calculations for the processing of 
 * each pixel, we need another approach to achive the objective.
 * 
 * The idea of this code came from the fact that the image looked 
 * blurry when scaled up, so we trying to add a blur filter before 
 * scaling down. Blur threshold should adjusted depending on 
 * situation, in my case 0.35px is enough for best result.
 * 
 * 
 * + Step :
 * + --------------------------------------------------------------
 *   1. draw image to canvas on original size
 *   2. add blur filter
 *   3. draw scaled image from step-2
 * 
 * 
 * + How to use?
 * + --------------------------------------------------------------
 *   var container = document.querySelector("body");
 *   var image = new Image();
 *   image.src = "http://localhost/link-to-image.jpg";
 *   
 *   image.onload = function(e) {
 *       var size = 100; // in px
 *       var thumb = __bengkel__.thumbnail.build(e.target, size);
 *       container.appendChild(thumb.build());
 *   }
 * 
 *   // to modify blur threshold:
 *   var thumb = __bengkel__.thumbnail.build(image, size, 0.35);
 * 
 *   // to use the box size image:
 *   var canvas = thumb.boxBuild();
 * 
 *   // to use only rescale max width or height of "size"
 *   var canvas = thumb.build();
 * 
 * 
 * + Useful link:
 * + --------------------------------------------------------------
 *   1. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas
 *   2. https://stackoverflow.com/a/19144434
 * 
 * 
 * + --------------------------------------------------------------
 *   NB: Any suggestions are welcome. :)
 * 
 */
(function (__, _) {


    function blurImage(size, image, w, h, threshold) {
        var scaledSize = size + size;
        var naturalSize = w + h;

        // TODO: need enhance for best result.
        var blur = (naturalSize / scaledSize) * threshold;

        var tmp = new OffscreenCanvas(w, h);
        var tmpCtx = tmp.getContext('2d');
        tmpCtx.filter = "blur(" + blur + "px)";
        tmpCtx.drawImage(image, 0, 0, w, h);

        return tmp;
    }

    function builder(image, w, smoothness = .35) {
        var imgw = image.naturalWidth;
        var imgh = image.naturalHeight;

        var tmp = blurImage(w, image, imgw, imgh, smoothness);

        var landscape = (imgw > imgh) * 1;
        var portrait = landscape ^ 1;

        var ratio = imgw / imgh;

        var width = (w * landscape) + (w * ratio * portrait);
        var height = (w * (1 / ratio) * landscape) + (w * portrait);

        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');

        function build() {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(tmp, 0, 0, width, height);
            return canvas;
        };

        function boxBuild() {
            canvas.width = w;
            canvas.height = w;

            var x = (w - width) * .5 * portrait;
            var y = (w - height) * .5 * landscape;

            ctx.drawImage(tmp, x, y, width, height);
            return canvas;
        }

        return {
            build,
            boxBuild
        };
    }

    __[_] = { builder };

})(__bengkel__, 'thumbnail');