'use strict';
domainAccountApp.controller('AccountSelectionCtrl', ['$scope', 'stoneViewService','$rootScope',
function ($scope, stoneViewService, $rootScope) {
    $scope.accountDetails = {};
    $scope.selectedAccountesList = [];
    $scope.modalId = $scope.$id;
    $scope.loggedInAccountSelected = false;

    if ($scope.selectedDomain === undefined || $scope.selectedDomain === null || $scope.selectedDomain.UserName === undefined) {
        $scope.selectedAccountesList = [];
        $scope.selectedAccountes = "Please select account name";
    } else {
        $scope.selectedAccountesList = [];
        $scope.selectedAccountesList.push($scope.selectedDomain);
        $scope.selectedAccountes = $scope.selectedDomain.UserName;
    }

    var configAccountInfoSeObj = {
        showEveryoneElement: true,
        searchText: "",
        IsPublic: false,
        showSearchBar: false,
        showAccountTree: true,
        showCheckbox: false,
        showRecurciveCheckOption: false,
    };

    $scope.selectAccount = function (domain) {
        $scope.selectedDomain = domain;
        $scope.selectedAccountesList = [];
        $scope.selectedAccountesList.push(domain);
        $scope.selectedAccountes = domain.UserName;
        if ($scope.onAccountSelected != undefined)
            $scope.onAccountSelected(domain);
        //$scope.updateList();
    };

    // Set Display Configuration 
    // Start Set Display Configuration 
    var initSettings = function () {
        var settings = {
            showEveryoneElement: false,
            searchText: "",
            IsPublic: false,
            showSearchBar: false,
            showAccountTree: false,
            showCheckbox: false,
            showRecurciveCheckOption: false
        };

        if ($scope.configSettings != undefined) {
            settings.showEveryoneElement = ($scope.configSettings != undefined) ? $scope.configSettings.showEveryoneElement : settings.showEveryoneElement;
            settings.searchText = ($scope.configSettings != undefined) ? $scope.configSettings.searchText : settings.searchText;
            settings.IsPublic = ($scope.configSettings != undefined) ? $scope.configSettings.IsPublic : settings.IsPublic;
            settings.showSearchBar = ($scope.configSettings != undefined) ? $scope.configSettings.showSearchBar : settings.showSearchBar;
            settings.showAccountTree = ($scope.configSettings != undefined) ? $scope.configSettings.showAccountTree : settings.showAccountTree;
            settings.showCheckbox = ($scope.configSettings != undefined) ? $scope.configSettings.showCheckbox : settings.showCheckbox;
            settings.showRecurciveCheckOption = ($scope.configSettings != undefined) ? $scope.configSettings.showRecurciveCheckOption : settings.showRecurciveCheckOption;
        }

        $scope.displayConfigSettings = settings;
        if ($rootScope.selectedDomain)
            $scope.selectAccount($rootScope.selectedDomain);
        return settings;
    };

    $scope.settingsDisplay = initSettings();

    $scope.onControlSettingsUpdate = function (configSettings) {
        $scope.settingsDisplay.showEveryoneElement = (configSettings.showEveryoneElement != undefined) ? configSettings.showEveryoneElement : $scope.settingsDisplay.showEveryoneElement;
        $scope.settingsDisplay.searchText = (configSettings.searchText != undefined) ? configSettings.searchText : $scope.settingsDisplay.searchText;
        $scope.settingsDisplay.IsPublic = (configSettings.IsPublic != undefined) ? configSettings.IsPublic : $scope.settingsDisplay.IsPublic;
        $scope.settingsDisplay.showSearchBar = (configSettings.showSearchBar != undefined) ? configSettings.showSearchBar : $scope.settingsDisplay.showSearchBar;
        $scope.settingsDisplay.showAccountTree = (configSettings.showAccountTree != undefined) ? configSettings.showAccountTree : $scope.settingsDisplay.showAccountTree;
        $scope.settingsDisplay.showCheckbox = (configSettings.showCheckbox != undefined) ? configSettings.showCheckbox : $scope.settingsDisplay.showCheckbox;
        $scope.settingsDisplay.showRecurciveCheckOption = (configSettings.showRecurciveCheckOption != undefined) ? configSettings.showRecurciveCheckOption : $scope.settingsDisplay.showRecurciveCheckOption;
    };

    // End Set Display Configuration 

    $scope.SelectionUpdate = function (account, action) {
        if (action == "Add")
        {
            $scope.selectedAccountesList.push(account);
        }

        if (action == "Remove")
        {
            $scope.selectedAccountesList.forEach(function (item) {
                if (item.UserID == account.UserID) {
                    var index = $scope.selectedAccountesList.lastIndexOf(item);
                    $scope.selectedAccountesList.splice(index, 1);
                }
            });
        }
        if (action == "Selected") {
            $scope.selectedDomain = account;
            $scope.selectedAccountesList = [];
            $scope.selectedAccountesList.push(account);
        }
        if ($scope.onAccountSelected != undefined)
            $scope.onAccountSelected($scope.selectedAccountesList);
        $scope.updateList();
    };

    $scope.clearSelection = function () {
        $scope.selectedDomain = null;
        $scope.selectedAccountesList = [];
        $scope.selectedAccountes = "Please select account name";
        if ($scope.onAccountSelected != undefined)
            $scope.onAccountSelected(null);
    };   

    $scope.updateList = function () {
        $scope.selectedAccountes = "";
        $scope.selectedAccountesList.forEach(function (item) {
            if ($scope.selectedAccountes.length != 0) {
                $scope.selectedAccountes += ", "
            }
            $scope.selectedAccountes += item.UserName;
        })
    };

    
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
            //    $scope.OnAccountDetailsLoaded(accountDetails);
            //}

            $scope.loadingAccount = false;
        });
    };

    $scope.$watch('accountId', function (newValue, oldValue) {
        if (newValue != oldValue) {
            $scope.getAccountDetails();
        }
    });
}]);