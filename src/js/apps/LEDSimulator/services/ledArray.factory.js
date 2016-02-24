(function() {
    'use strict';

    angular
        .module('ledSimulator')
        .factory('ledArrayService', ledArrayService);

    ledArrayService.$inject = ['$rootScope', '$interval'];

    /* @ngInject */
    function ledArrayService($rootScope, $interval) {
        var leds = [];
        var timer = null;
        var dimensions = {w:20, h:20, p:20, co:1};
        var colorToggles = {r:true, g:true, b:true};
        var plasmaParams = {
            a:0.5, s: 0.1, l: 0.63,
            ph:5, f:0.01, w:100, wo:127,
            rf:0.31, gf:0.31, bf:0.31,
            rp:0.0, gp:0.0, bp:0.0,
            rw:127, gw:127, bw:127,
            rfs:0.25, rps:0.03, rws:0.3,
            gfs:-0.13, gps:0.07, gws:0.12,
            bfs:0.09, bps:0.04, bws:0.24
        };
        
        var service = {
            dimensions: dimensions,
            plasmaParams: plasmaParams,
            colorToggles: colorToggles,
            leds: leds,
            activateArray: activateArray,
            adjustDimensions: adjustDimensions,
            forEachLED: forEachLED,
            forEachInCol: forEachInCol,
            forEachInRow: forEachInRow,
            removeColor: removeColor,
            addColor: addColor,
            cancelAnimation: cancelAnimation,
            randomize: randomize,
            rainbow: rainbow,
            plasma: plasma
        };
        return service;

        ////////////////
        function activateArray(){
            for(var a=0; a<dimensions.h*dimensions.w; a++){
                leds.push({red:0, green:0, blue:0});
            }
        }

        function adjustDimensions(){
            var area = dimensions.w*dimensions.h;
            var diff = area - leds.length;
            plasmaParams.a = (dimensions.co*10)/dimensions.w;

            if(diff > 0){
                while(leds.length < area){
                    leds.push({red:0, green:0, blue:0});
                }
            }
            else if(diff < 0){
                while(leds.length > area){
                    leds.shift();
                }
            }

        }

        function forEachLED(actions){
            for(var a=0; a<leds.length; a++){
                var led = leds[a];
                actions(led, a);
            }
        }

        function forEachInCol(col, actions){
            for(var a=0; a<dimensions.h; a++){
                var led = leds[a*dimensions.w+col];
                actions(led, a);
            }
        }

        function forEachInRow(row, actions){
            for(var a=0; a<dimensions.w; a++){
                var led = leds[a+dimensions.w*row];
                actions(led, a);
            }
        }

        function removeColor(color) {
            $interval.cancel(timer);
            forEachLED(function(led){
                led[color] = 0;
            });
        }

        function addColor(color, value) {
            $interval.cancel(timer);
            forEachLED(function(led){
                led[color] = value || 255;
            });
        }

        function cancelAnimation(){
            $interval.cancel(timer);
        }

        function randomize(){
            $interval.cancel(timer);
            forEachLED(function(led){
                led.red = Math.ceil(Math.random()*255);
                led.green = Math.ceil(Math.random()*255);
                led.blue = Math.ceil(Math.random()*255);
            });
        }

        function rainbow(){
            $interval.cancel(timer);
            var t = 0;
            timer = $interval(function(){
                forEachLED(function(led, a){
                    led.red = Math.round(Math.cos(t*0.01)*128 + 127);
                    led.green = Math.round(Math.cos(t*0.01+(Math.PI/2))*128 + 127);
                    led.blue = Math.round(Math.cos(t*0.01+Math.PI)*128 + 127);
                });
                t++;
            },10);
        }

        function plasma(){
            $interval.cancel(timer);
            var t = 0;
            timer = $interval(function(){
                // modulate sine frequency, phasing and widths for each color
                plasmaParams.rf = Math.cos(t*(plasmaParams.rfs*plasmaParams.s))*plasmaParams.f + plasmaParams.l;
                plasmaParams.rp = Math.cos(t*(plasmaParams.rps*plasmaParams.s))*plasmaParams.ph;
                plasmaParams.rw = Math.cos(t*(plasmaParams.rws*plasmaParams.s))*plasmaParams.w + plasmaParams.wo;

                plasmaParams.gf = Math.cos(t*(plasmaParams.gfs*plasmaParams.s))*plasmaParams.f + plasmaParams.l;
                plasmaParams.gp = Math.cos(t*(plasmaParams.gps*plasmaParams.s))*plasmaParams.ph;
                plasmaParams.gw = Math.cos(t*(plasmaParams.gws*plasmaParams.s))*plasmaParams.w + plasmaParams.wo;

                plasmaParams.bf = Math.cos(t*(plasmaParams.bfs*plasmaParams.s))*plasmaParams.f + plasmaParams.l;
                plasmaParams.bp = Math.cos(t*(plasmaParams.bps*plasmaParams.s))*plasmaParams.ph+10;
                plasmaParams.bw = Math.cos(t*(plasmaParams.bws*plasmaParams.s))*plasmaParams.w + plasmaParams.wo;

                forEachLED(function(led, a){
                    // modulate color fade with sine (randomness from above calcs)
                    a *= plasmaParams.a;
                    led.red =   !colorToggles.r ? 0 : Math.round(Math.cos(a*plasmaParams.rf+plasmaParams.rp)*128 + plasmaParams.rw);
                    led.green = !colorToggles.g ? 0 : Math.round(Math.cos(a*plasmaParams.gf+plasmaParams.gp)*128 + plasmaParams.gw);
                    led.blue =  !colorToggles.b ? 0 : Math.round(Math.cos(a*plasmaParams.bf+plasmaParams.bp)*128 + plasmaParams.bw);
                });
                
                t++;
            }, 10);
        }
    }
})();