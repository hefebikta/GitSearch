'use strict';
domainAccountApp.controller('AccountManagerCtrl', ['$scope', 'accountService',
function ($scope, accountService) {
    var _this = this;
    var accountsList = [];
    var accountsTree = [];
    var selectedAccounts = [];
    $scope.domainAccountsList = [];
    $scope.selectedAccountIds = [];
    $scope.selectedAccountsOnDomainAccount = [];

    //$scope.domainAccountsList = accountService.getAccounts();
    var selectAccount = function (accountItem) {
        var item = {
            UserID: accountItem.DomainUserId, DomainID: accountItem.Id, UserName: accountItem.DomainUserName
        };

        $scope.onSelectionUpdate({ account: item, action: "Add" });

        if ($scope.selectedAccountsOnDomainAccount.indexOf(item) == -1) {
            $scope.selectedAccountsOnDomainAccount.push(item);
        }
        broadcast('accountService.selectedAccounts', $scope.selectedAccountsOnDomainAccount);
    };

    $scope.selectAccount = function (accountItem) {
        var item = {
            UserID: accountItem.DomainUserId, DomainID: accountItem.Id, UserName: accountItem.DomainUserName
        };
        $scope.onSelectionUpdate({ account: item, action: "Selected"});
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

    // Private function
    // Start Private function
    $scope.getAccounts = function () {
        accountService.setMode(function () {
            $scope.getAccountTree();
        });

    };

    $scope.selectLoggedinAccount = function () {
        accountService.getLoggedInAccountForView(function (data) {
            if (data) {
                $scope.$parent.loggedInAccountSelected =true;
                $scope.selectAccount(data);
            }
        })
    };

    $scope.getPermittedAccounts = function () {
        accountService.getPermittedAccounts(function (data) {
            $scope.domainAccountsList = [];
            $scope.domainAccountsTree = null;
            $scope.domainAccountsTree = data;
        });
    };

    $scope.getAccountTree = function () {
        accountService.getAccounts(accountsTree, accountsList, function (accountsTree) {
            $scope.domainAccountsList = [];
            $scope.domainAccountsTree = null;
            $scope.domainAccountsTree = accountsTree;
            $scope.updateDomainAccountsList(accountsTree);
        });
    };

    $scope.updateDomainAccountsList = function (accountsTree) {

        $scope.domainAccountsList.push(accountsTree[0]);

        if (accountsTree[0].childAccounts != undefined) {
            accountsTree[0].childAccounts.forEach(function (item) {
                if (item.childAccounts != null) {
                    $scope.updateRecursiveDomainAccountsList(item);
                }
                else {
                    $scope.domainAccountsList.push(item);
                }
            });
        }

    };

    $scope.updateRecursiveDomainAccountsList = function (accountsTree) {

        $scope.domainAccountsList.push(accountsTree);

        if (accountsTree.childAccounts != undefined) {
            accountsTree.childAccounts.forEach(function (item) {
                if (item.childAccounts != undefined) {
                    $scope.updateRecursiveDomainAccountsList(item);
                }
                else {
                    $scope.domainAccountsList.push(item);
                }
            });
        }

    };

    $scope.getAccountDetails = function (accountId) {
        return $scope.domainAccountsList.filter(function (item) {
            return item.UserID == accountId;
        })[0];
    };
    var isTreeChecked = function (parentAccount) {
        var isChecked = true;
        parentAccount.childAccounts.forEach(function (a) {
            isChecked = isTreeChecked(a) ? isChecked : false;
        });
        var account = $scope.getSelectedAccount(parentAccount.UserID);
        isChecked = (account != null) ? isChecked : false;
        return isChecked;
    }

    var unCheckTree = function (parentAccount) {
        unselectAccount(parentAccount);
        parentAccount.childAccounts.forEach(function (a) {
            unCheckTree(a);
        });
    };

    var checkTree = function (parentAccount) {
        selectAccount(parentAccount);
        parentAccount.childAccounts.forEach(function (a) {
            checkTree(a);
        });
    };

    var broadcast = function (eventName, data) {
        //$rootScope.$broadcast(eventName, data);
    };

    var inerSetSelectedAccountIds = function (accountsIds) {
        $scope.selectedAccountsOnDomainAccount = accountsIds;
        broadcast('accountService.selectedAccounts', $scope.selectedAccountsOnDomainAccount);
    };

    var selectAllAccounts = function () {
        angular.forEach(accountsList, function (item, key) {
            selectAccount(item);
        });
    };

    var clearAllAccounts = function () {
        var selectedAccounts = [];
        broadcast('accountService.selectedAccounts', selectedAccounts);
    };

    var unselectAccount = function (accountItem) {
        var removeAllDuplicateIndexs = [];
        $scope.selectedAccountsOnDomainAccount.forEach(function (item) {
            if (item.UserID == accountItem.UserID) {
                var index = $scope.selectedAccountsOnDomainAccount.lastIndexOf(item);
                $scope.onSelectionUpdate({ account: item, action: "Remove" });
                removeAllDuplicateIndexs.push(index);
            }
        });
        removeAllDuplicateIndexs = removeAllDuplicateIndexs.reverse();
        removeAllDuplicateIndexs.forEach(function (index) {
            $scope.selectedAccountsOnDomainAccount.splice(index, 1);
        });
    };


    // End Private function

    // Private Toggle Childs function
    // Start Private Toggle Childs function
    $scope.toggleChilds = function (account) {
        account.showChilds = !account.showChilds
    };

    $scope.toggleAccountTree = function (account) {
        if (isTreeChecked(account)) {
            unCheckTree(account)
        }
        else {
            checkTree(account);
        }
    };

    $scope.toggleAccount = function (accountId) {
        var accountItem = $scope.getSelectedAccount(accountId);
        if (accountItem == null) {
            selectAccount($scope.getAccountDetails(accountId));
        }
        else {
            unselectAccount(accountItem);
        };
    };
    // End Private Toggle Childs function

    // Private Checkbox function
    // Start Checkbox function

    $scope.checkAllAccounts = function () {
        accountService.selectAllAccounts();
    };

    $scope.deCheckAllAccounts = function () {
        accountService.clearAllAccounts();
    };

    $scope.isAccountSelected = function (accountId) {
        var account = $scope.getSelectedAccount(accountId);
        return (account != null);
    };

    $scope.setSelectedAccountIds = function () {
        inerSetSelectedAccountIds($scope.selectedAccountIds);
    };

    $scope.getSelectedAccountIds = function () {
        return $scope.selectedAccountsOnDomainAccount;
    };

    $scope.unCheckAccount = function (accountId) {
        unselectAccount(accountId);
    }

    $scope.getSelectedAccount = function (accountId) {
        return $scope.selectedAccountsOnDomainAccount.filter(function (item) { return item.UserID == accountId })[0];
    };

    // End Checkbox function

    $scope.onChange = function (IDs, IsPrivate) {
    };

    $scope.onAccountDetailsChange = function (accountDetails) {
        if (accountDetails != undefined) {
            $scope.settingsDisplay.searchText = accountDetails.FirstName;
            $scope.settingsDisplay.showAccountTree = true;
        }
    };

    //$scope.addAccount = function (accountId) {
    //    _this.selectAccount(accountId);
    //};

    $scope.setPublic = function (isPublic) {
        $scope.public = isPublic;
        $scope.onChange($scope.selectedAccountIds, $scope.public)
    };

    $scope.getAccounts();
}]);