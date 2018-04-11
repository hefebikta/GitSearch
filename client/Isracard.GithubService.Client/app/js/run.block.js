
(function () {
    "use strict";
    function runBlock($http, $location, ipCookie) {
        angular.bootstrap(document, ['StoneService']);
    }

    // inject cookies for future credentials use
    runBlock.$inject = ['$http', '$location', 'ipCookie'];

    angular.module("StoneService.Bootstarper").factory("runBlock", runBlock).run(runBlock);

})();

angular.bootstrap(document.createElement("div"), ['StoneService.Bootstarper']);
