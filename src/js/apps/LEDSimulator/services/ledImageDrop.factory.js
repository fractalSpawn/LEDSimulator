(function() {
    'use strict';

    angular
        .module('ledSimulator')
        .factory('ledImageDropService', ledImageDropService);

    ledImageDropService.$inject = ['ledArrayService', '$rootScope'];

    /* @ngInject */
    function ledImageDropService(ledArrayService, $rootScope) {
        var service = {
            activateImageDrop: activateImageDrop,
        };
        return service;

        ////////////////

        function activateImageDrop(){
            var imageDrop = document.getElementById('imageDrop');
            imageDrop.addEventListener('dragover', function(e){ e.preventDefault();}, true);
            imageDrop.addEventListener('drop', function(e){
                e.preventDefault(); 
                loadImage(e.dataTransfer.files[0]);
                $rootScope.$digest();
            }, true);
        }

        function loadImage(src){
            if(!src.type.match(/image.*/)){
                console.warn("That's not an image");
                return;
            }

            ledArrayService.cancelAnimation();

            var reader = new FileReader();
            reader.onload = function(e){
                render(e.target.result);
            };
            reader.readAsDataURL(src);
        }

        function render(src, dir){
            var image = new Image();
            image.src = src;
            image.onload = function(){
                var colors = readColorsFromImage(image);
                ledArrayService.forEachLED(function(led, a){
                    led.red = colors[a][0];
                    led.green = colors[a][1];
                    led.blue = colors[a][2];
                });
                $rootScope.$digest();
            };
        }

        function readColorsFromImage(image){
            var colors = [];
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext("2d");
            var xDivs = image.width/ledArrayService.dimensions.w;
            var yDivs = image.height/ledArrayService.dimensions.h;

            canvas.width = image.width;
            canvas.height = image.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, image.width, image.height);

            for(var y=0; y<ledArrayService.dimensions.h; y++){
                for(var x=0; x<ledArrayService.dimensions.w; x++){
                    var color = ctx.getImageData(x*xDivs, y*yDivs, 1, 1).data;
                    colors.push(color);
                }
            }
            return colors;
        }
    }
})();