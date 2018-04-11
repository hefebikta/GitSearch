(function () {
    "use strict";
    function rootCtrl($rootScope, $location, $http, env) {
    }
    angular.module("StoneService.Controllers").controller("RootCtrl", rootCtrl);
    rootCtrl.$inject = ["$rootScope", "$location", "$http","ENV"];
})();