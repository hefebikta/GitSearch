'use strict';
var domainAccountAppDirectives = angular.module('domainAccountApp.directives', []);
domainAccountAppDirectives.directive('accountInfo', function () {
    return {
        templateUrl: 'UIComponent/DomainAccountTree/html/AccountInfo.html',
        restrict: "E",
        scope: {
            accountId: '=',
            onAccountLoaded: '&'
        },
        controller: 'AccountInfoCtrl'
    }
});
