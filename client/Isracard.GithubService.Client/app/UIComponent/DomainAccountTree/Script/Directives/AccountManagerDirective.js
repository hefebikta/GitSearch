//var domainAccountAppDirectives = angular.module('domainAccountApp.directives', []);
domainAccountAppDirectives.directive('accountManager', [ function ($scope, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            public: '=',
            //onChange: '=',
            //onAccountDetailsChange: '=',
            onControlSettingsUpdate: '=',
            onSelectionUpdate: '&',
            configSettings: '=?'
        },
        controller: 'AccountManagerCtrl',
        templateUrl: 'UIComponent/DomainAccountTree/html/DomainAccountTree.html',
        link: function (scope) {
            scope.$watch('selectedAccountIds', function (selectedAccounts) {
                if (selectedAccounts == undefined) 
                {
                    selectedAccounts = [];
                }
                if (selectedAccounts != scope.getSelectedAccountIds())
                    scope.setSelectedAccountIds();
            });

        }
    }
}]);
