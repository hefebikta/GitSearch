(function () {
    "use strict";
    function httpInterceptor($q, $location, ipCookie) {
        return {
        }
    }

    httpInterceptor.$inject = ['$q', '$location', 'ipCookie'];

    angular.module("StoneService.Http").factory("httpInterceptor", httpInterceptor);

})();