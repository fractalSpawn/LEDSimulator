(function() {
    'use strict';

    angular
        .module('ledSimulator')
        .factory('ledArrayService', ledArrayService);

    ledArrayService.$inject = ['$interval'];

    /* @ngInject */
    function ledArrayService($interval) {
        var leds = [];
        var timer = null;
        var params = {
            s: 0.18,
            rf:0.31, gf:0.31, bf:0.31,
            rp:0.0, gp:0.0, bp:0.0,
            rw:127, gw:127, bw:127,
            rfs:0.25, rps:0.03, rws:0.3,
            gfs:-0.13, gps:0.07, gws:0.12,
            bfs:0.09, bps:0.04, bws:0.24,
        };
        var colors = [
            {r:255, g:0, b:0}, {r:255, g:128, b:0}, {r:255, g:255, b:0}, {r:128, g:255, b:0},
            {r:0, g:255, b:0}, {r:0, g:255, b:128}, {r:0, g:255, b:255}, {r:0, g:128, b:255},
            {r:0, g:0, b:255}, {r:128, g:0, b:255}, {r:255, g:0, b:255}, {r:255, g:0, b:128}
        ];

        var service = {
            rows: 1,
            cols: 1,
            params: params,
            leds: leds,
            activateArray: activateArray,
            removeColor: removeColor,
            addColor: addColor,
            randomize: randomize,
            rainbow: rainbow,
            sine: sine
        };
        return service;

        ////////////////
        function activateArray(){
            for(var a=0; a<service.rows*service.cols; a++){
                leds.push({id:a, red:0, green:0, blue:0});
            }
        }

        function forEachLED(actions){
            for(var a=0; a<leds.length; a++){
                var led = leds[a];
                actions(led, a);
            }
        }

        function forEachInCol(col, actions){
            for(var a=0; a<service.rows; a++){
                var led = leds[a*service.cols+col];
                actions(led, a);
            }
        }

        function forEachInRow(row, actions){
            for(var a=0; a<service.cols; a++){
                var led = leds[a+service.cols*row];
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
            var col = 0;
            var dir = true;
            var color = 0;
            timer = $interval(function(){
                forEachInCol(col, function(led){
                    led.red = colors[color].r;
                    led.green = colors[color].g;
                    led.blue = colors[color].b;
                });

                col = dir ? col+1 : col-1;
                if(col == service.cols){
                    col = 0;
                    color++;
                }
                if(color == colors.length) color = 0;
            },10);
        }

        function sine(){
            $interval.cancel(timer);
            var t = 0;
            timer = $interval(function(){
                forEachLED(function(led, a){
                    led.red = Math.round(Math.sin(params.rf*a+params.rp)*128 + params.rw);
                    led.green = Math.round(Math.sin(params.gf*a+params.gp)*128 + params.gw);
                    led.blue = Math.round(Math.sin(params.bf*a+params.bp)*128 + params.bw);
                });
                t++;

                params.rf = Math.sin((params.rfs*params.s)*t)*0.01 + 0.31;
                params.rp = Math.sin((params.rps*params.s)*t)*5;
                params.rw = Math.sin((params.rws*params.s)*t)*100 + 127;

                params.gf = Math.sin((params.gfs*params.s)*t)*0.01 + 0.31;
                params.gp = Math.sin((params.gps*params.s)*t)*5;
                params.gw = Math.sin((params.gws*params.s)*t)*100 + 127;

                params.bf = Math.sin((params.bfs*params.s)*t)*0.01 + 0.31;
                params.bp = Math.sin((params.bps*params.s)*t)*5;
                params.bw = Math.sin((params.bws*params.s)*t)*100 + 127;
            }, 10);
        }
        
    }
})();