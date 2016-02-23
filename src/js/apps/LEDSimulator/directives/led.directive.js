(function() {
    'use strict';

    var template = '<div class="led" style="width:{{vm.pixelSize}}px; height:{{vm.pixelSize}}px; background-color:rgb({{vm.red}},{{vm.green}},{{vm.blue}});" ng-transclude></div>';

    angular
        .module('ledSimulator')
        .directive('led', led);

    led.$inject = [];

    /* @ngInject */
    function led() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            restrict: 'EA',
            template: template,
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            transclude: true,
            scope: {
                red: '=',
                green: '=',
                blue:'=',
                pixelSize: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

    /* @ngInject */
    function Controller() {
        var vm = this;

        ////////////
    }
})();