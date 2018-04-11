'use strict'
var domainAccountAppDirectives = angular.module('domainAccountApp.directives', []);
domainAccountAppDirectives.directive('accountSelection', function () {
    return {
        templateUrl: 'UIComponent/DomainAccountTree/html/AccountSelection.html',
        restrict: "E",
        replace: true,
        scope: {
            //accountId: '=?',
            selectedDomain: '=?',
            modalId: '=?',
            configSettings: '=?',
            onControlSettingsUpdate: '=?',
            onAccountSelected: '=?'
        },
        controller: 'AccountSelectionCtrl'
    }
});
