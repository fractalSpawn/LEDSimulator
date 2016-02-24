(function() {
    'use strict';

    angular
        .module('ledSimulator')
        .controller('ledArray', ledArray);

    ledArray.$inject = ['ledArrayService', 'ledImageDropService'];

    /* @ngInject */
    function ledArray(ledArrayService, ledImageDropService){
        var vm = this;
        vm.title = 'ledArray';
        vm.dimensions = ledArrayService.dimensions;
        vm.leds = ledArrayService.leds;
        vm.plasmaParams = ledArrayService.plasmaParams;
        vm.colorToggles = ledArrayService.colorToggles;
        vm.reset = ledArrayService.randomize;
        vm.removeColor = ledArrayService.removeColor;
        vm.addColor = ledArrayService.addColor;
        vm.adjustDimensions = ledArrayService.adjustDimensions;
        vm.rainbow = ledArrayService.rainbow;
        vm.plasma = ledArrayService.plasma;
        vm.file = null;
        
        activate();

        ////////////////

        function activate() {
            ledArrayService.activateArray();
            ledImageDropService.activateImageDrop();
            ledArrayService.randomize();
        }
    }
})();