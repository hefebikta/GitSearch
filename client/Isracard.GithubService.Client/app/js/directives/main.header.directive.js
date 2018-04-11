(function () {
    "use strict";

    function mainHeader() {
        return {
            restrict: 'E',
            templateUrl: 'partials/header.html?___version___',
            replace: true,
            scope: true
        }
    }

    angular.module("StoneService.Directives").directive('mainHeader', mainHeader);

    
})();