'use strict';

function AccountInfoCtrl($scope, stoneViewService) {
    $scope.accountDetails = {};

    var configAccountInfoSeObj = {
        showEveryoneElement: false,
        searchText: "",
        IsPublic: false,
        showSearchBar: false,
        showAccountTree: false,
        showCheckbox: false,
        showRecurciveCheckOption: false
    }
    
    $scope.getAccountDetails = function () {
        $scope.loadingAccount = true;
        $scope.account = {};

        stoneViewService.getAccountDetails($scope.accountId, function (accountDetails) {
            $scope.accountDetails = accountDetails;
            $scope.account = accountDetails;
            
            if ($scope.UpdateControlSettings !== undefined) {
                $scope.UpdateControlSettings(configAccountInfoSeObj);
            }

            //if ($scope.OnAccountDetailsLoaded !== undefined) {
            //    $scope.OnAccountDetailsLoaded( accountDetails );
            //}

            $scope.loadingAccount = false;
        });

        
    };

    $scope.$watch('accountId', function (newValue, oldValue) {
        if (newValue != oldValue) {
            $scope.getAccountDetails();
        }
    });
};