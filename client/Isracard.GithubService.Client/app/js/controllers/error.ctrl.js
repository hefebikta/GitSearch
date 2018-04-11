(function () {
    "use strict";

    function errorCtrl($scope, $timeout, $location, $routeParams) {
        $scope.action = $routeParams ? $routeParams.action : null;
    }

    angular.module("StoneService.Controllers").controller("ErrorCtrl", errorCtrl);

    errorCtrl.$inject = ["$scope", "$timeout", "$location", "$routeParams"];

})();