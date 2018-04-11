//defing routing
"use strict";

var isRedirectingToLogin = false;
function redirectToLogin() {
    if (isRedirectingToLogin)
        return;
    else {
        isRedirectingToLogin = true;
        var currentLocation = encodeURIComponent(location.origin + location.pathname + "#");
        window.location.replace(ENV.IP_URL + "/Account/ViewLogin?url=" + currentLocation + "&language=en&assembly=" + VERSION.version + "&stayLogin=false");
    }
}


// Declare app level module which depends on filters, and services
var StoneService = angular
    .module("StoneService", [
        "StoneService.Controllers",
        "StoneService.Directives",
        "StoneService.Services",
        "StoneService.Filters",
        "StoneService.Http",
        "ngRoute",
        "ngResource",
        "ui.bootstrap",
        "cgPrompt",
        "dialogs.main",
        "checklist-model",
        "ngCsv",
        "domainAccountApp",
        "stoneListApp"
    ])
    .value("ENV", ENV)
    .value("ENV_URL", ENV.SERVER_URL)
    .config(["$routeProvider",
        function ($routeProvider) {
            $routeProvider.when("/error/:action?", { templateUrl: "partials/error.html?___version___", controller: "ErrorCtrl" });
            $routeProvider.when("/", {
                templateUrl: "partials/stoneList.html?___version___",
                controller: "RepositoryListCtrl"
            }); 
            $routeProvider.when("/tags", {
                templateUrl: "partials/tags.html?___version___",
                controller: "TagListCtrl"
            });
            $routeProvider.when("/resources", {
                templateUrl: "partials/resources.html?___version___",
                controller: "ResourceListCtrl"
            });
            $routeProvider.otherwise({ redirectTo: "/" });
        }
    ]);


angular.module("StoneService.Filters", ["StoneService.Services"]);
angular.module("StoneService.Controllers", ["StoneService.Services", "ui.bootstrap", "ipCookie", "ngCsv"]);
angular.module("StoneService.Services", ["ngResource"]);
angular.module('StoneService.Directives', ['cgPrompt', 'ui.bootstrap', 'ngResource', 'ngSanitize', 'StoneService.Services']);
angular.module("StoneService.Http", ['ipCookie']).config(['$httpProvider',
    function($httpProvider) {
        //http interception - to deal with http errors (future), logging & authentication
        $httpProvider.interceptors.push('httpInterceptor');
        // for now, we don't deal with access credentials
        $httpProvider.defaults.withCredentials = false;
    }
]);
angular.module('StoneService.Bootstarper',['StoneService.Http', 'ipCookie']);
