(function() {
    'use strict';

    angular
        .module('ledSimulator')
        .controller('ledArray', ledArray);

    ledArray.$inject = ['ledArrayService'];

    /* @ngInject */
    function ledArray(ledArrayService) {
        var vm = this;
        vm.title = 'ledArray';
        vm.rows = ledArrayService.rows = 10;
        vm.cols = ledArrayService.cols = 20;
        vm.pixelSize = 40;
        vm.leds = ledArrayService.leds;
        vm.reset = ledArrayService.randomize;
        vm.removeColor = ledArrayService.removeColor;
        vm.addColor = ledArrayService.addColor;
        vm.rainbow = ledArrayService.rainbow;
        vm.sine = ledArrayService.sine;
        vm.params = ledArrayService.params;
        activate();

        ////////////////

        function activate() {
            ledArrayService.activateArray();
            ledArrayService.randomize();
        }
    }
})();