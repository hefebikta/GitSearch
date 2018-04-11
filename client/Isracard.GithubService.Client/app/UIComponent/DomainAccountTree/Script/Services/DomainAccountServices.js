'use strict';
//var moveStoneService = angular.module('moveStoneApp.services', ['ngResource']);
angular.module('domainAccountApp.services', ['ngResource'])
.factory('domainNamesConfig', ['$resource', function ($resource) {
    return $resource(ENV.OC_URL + '/DomainName/DomainNames', {}, {
        getDomainNames: {
            method: 'GET',
            isArray: false
        }
    });
}])
.factory('AccountRepository', ['$resource', function ($resource) {
    return $resource(ENV.OC_URL + 'api/:command', {}, {
            login: {
                method: 'GET',
                params: { command: 'Account/Login', returnUrl: '@returnUrl', stayLogin: '@stayLogin' },
                isArray: false
            }
        });
}])
.factory('domainAccountRepository', ['$resource', function ($resource) {
    return $resource(ENV.OC_URL + '/api/ApiDomain/:command', {}, {
        getAccountsDomainList: {
            method: 'GET',
            params: {
                command: 'GetAllDomainsEx', Id: '@Id'
            },
            isArray: true
        },
        getAccountsList: {
            method: 'GET',
            params: {
                command: 'GetAllDomains', Id: '@Id'
            },
            isArray: true
        },
        getAccountsUserList: {
            method: 'GET',
            params: {
                command: 'GetAllUsers', Id: '@Id'
            },
            isArray: true
        },
        getAccountsDomainTree: {
            method: 'GET',
            params: {
                command: 'GetAllDomainsTree'
            },
            isArray: true
        },
        getLoggedInAccount: {
            method: 'GET',
            params: {
                command: 'GetLoggedInAccount', Id: '@Id'
            },
            isArray: false
        },
        getPermittedAccounts: {
            method: 'GET',
            params: {
                command: 'GetAssociatedAccounts', Id: '@Id'
            },
            isArray: true
        },
        getIsDomainServiceCenter: {
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            params: {
                command: 'GetIsDomainServiceCenter', Id: '@Id'
            },
            isArray: false
        }

    });
}])
.factory('accountsRepository', ['$resource', function ($resource) {

    return $resource(ENV.OC_URL+'/Account/:command', {}, {
        getAccountInfo: {
            method: 'GET',
            params: { userId: '@userId', command: 'GetAccountInfo' },
            isArray: false
        },
        getPermissions: {
            method: 'GET',
            params: { command: 'GetUserPermissions' },
            isArray: false
        }
    })
}])
.factory('accountInfoService', ['$resource', function ($resource) {

    return $resource(ENV.IP_URL + '/:command/:appId', {}, {
        getUserDataExtended: {
            method: 'GET',
            params: { command: '/api/v1/account/userdataextended', appId: '@appId' },
            isArray: false
        }
    })
}])
.factory('ipRepository', ['$resource', function ($resource) {

    return $resource(ENV.IP_URL + '/:command/:userId/:graphId/:level', {}, {
        getCustomers: {
            method: 'GET',
            params: { command: '/api/v1/domain/graph/customer/settings/', userId: '@userId', graphId: '@graphId', level: '@level' },
            isArray: true
        }
    })
}])
.service('accountsService', ['accountsRepository', function (accountsRepository) {
    this.getAccountInfo = function (userId, callback) {
        accountsRepository.getAccountInfo({ userId: userId }, function (data) {
            if (callback)
                callback(data);
        });
    };
    var permission;
    this.getPermissions = function (callback) {
        if (!permission) {
            accountsRepository.getPermissions(function (data) {
                permission = data;
                if (callback)
                    callback(permission);
            });
        }
        else
            if (callback)
                callback(permission);
    }
}])
.service('accountService', ['$rootScope', 'domainAccountRepository', 'accountsService', 'ipRepository', 'accountInfoService', function ($rootScope, domainAccountRepository, accountsService, ipRepository, accountInfoService) {
    //var accountsList = [];
    //var accountsTree = [];

    //  graphId = 1 (reseller) = 2 (Service Center) 
    var graphId = 1;
    var treeLevels = 1;

    // Appid = 5 (Account management) for check 'ViewAllDomains' Permission.
    var appId = 5;

    var broadcast = function (eventName, data) {
        $rootScope.$broadcast(eventName, data);
    };

    this.setMode = function (callback) {
        var cookie = OCCookies.getCookie('UserId');
        if (cookie == null) {
            redirectToLogin();
        }
        
        accountInfoService.getUserDataExtended({ appId: appId }, function (result) {
            if (result.Settings)
                result.Settings.forEach(function (setting) {
                    if (setting.SettingId == 2)
                        graphId = 2;
                });

            if (result.Permissions.ViewAllDomains && result.Permissions.ViewAllDomains.Allow)
                 treeLevels = -1;
            
            callback();
        });
    };

    this.getAccounts = function (accountsTree, accountsList, callback) {
        if (accountsList.length == 0 || callback != undefined) {
            accountsList = [];
            accountsTree = [];
            var cookie = OCCookies.getCookie('UserId');
            if (cookie == null) {
                redirectToLogin();
            }



            ipRepository.getCustomers({
                userId: cookie, graphId: graphId, level: treeLevels
            }, function (data) {
                accountsList = data;
                var userId = accountsList[0].Id;
                accountsList.forEach(function (account) {
                    if (account.childAccounts == undefined) {
                        account.childAccounts = [];
                    }
                    var parentAccount = accountsList.filter(function (parent) { return ((parent.Id == account.ParentId) && (account.Id != account.ParentId)) })[0];
                    if (parentAccount != undefined) {
                        if (parentAccount.childAccounts == undefined) {
                            parentAccount.childAccounts = [];
                        }
                        account.showChilds = true;
                        parentAccount.childAccounts.push(account);
                    }
                    // View list only of its own hierarchy
                    else if (account.Id == userId) {
                        account.showChilds = true;
                        accountsTree.push(account);
                    }
                });
                callback(accountsTree);
            });
        }
        else {
            callback(accountsTree);
        }
    };

    this.getLoggedInAccountForView = function (callbackForView) {
        var cookie = OCCookies.getCookie('UserId');
        domainAccountRepository.getLoggedInAccount({ Id: cookie }, function (data) {
            callbackForView(data);
        }, function (error) { console.log(error); }
        );
    };
    this.getPermittedAccounts = function (callback) {
        var cookie = OCCookies.getCookie('UserId');
        domainAccountRepository.getPermittedAccounts({ Id: cookie }, function (data) {
            callback(data);
        }, function (error) { console.log(error); }
        );

    }

    //this.getAccounts();

}])
.service('domainAccountService', ['domainAccountRepository', function (domainAccountRepository) {
    var _this = this;
    var userDetails = [];
    var domainDetails = [];

    var accountDomainDetails = {};

    this.getUsers = function (id, callbackUsers) {
        if (id != undefined && id != '00000000-0000-0000-0000-000000000000') {
            domainAccountRepository.getAccountsUserList({ Id: id },
                function (data) {
                    userDetails = data;
                    callbackUsers(userDetails);
                },
                function (err) {
                    console.log(err);
                });
        }
    };
    this.getAccounts = function (id, callbackAccounts) {
        if (id != undefined && id != '00000000-0000-0000-0000-000000000000') {
            domainAccountRepository.getAccountsDomainList({ Id: id },
                function (data) {
                    domainDetails = data;
                    callbackAccounts(domainDetails);
                },
                function (err) {
                    console.log(err);
                });
        }
    };

    this.mergeAccountAndUsers = function (accountId, callbackFormMearge) {
        if ((userDetails.length != 0) && (domainDetails.length != 0)) {
            var usersDictionary = {};

            // Output
            //var domainClientList = {};

            userDetails.forEach(function (user) {
                usersDictionary[user.Id.toString()] = user;
            });

            domainDetails.forEach(function (domain) {

                var userParentDomainID = '00000000-0000-0000-0000-000000000000';
                var userFirstName = "Unknown";
                var userLastName = "Unknown";

                if (usersDictionary[domain.DomainUserDetails] != undefined) {
                    userParentDomainID = usersDictionary[domain.DomainUserDetails].Id;
                    userFirstName = usersDictionary[domain.DomainUserDetails].FirstName;
                    userLastName = usersDictionary[domain.DomainUserDetails].LastName;
                }

                var domainClientItem =
                {
                    DomainUserDetails: domain.DomainUserDetails,
                    ParentDomainUserDetails: userParentDomainID,
                    Id: domain.Id,
                    ParentId: domain.ParentId,
                    FirstName: userFirstName,
                    LastName: userLastName,
                    Users: domain.Users
                };

                accountDomainDetails[domain.DomainUserDetails] = domainClientItem;
            });
        }

        callbackFormMearge(accountDomainDetails);
    };

    this.accountForView = function (accountId, callbackForView) {
        var upToDate = (accountId in accountDomainDetails);

        if (!upToDate) {
            //userDetails = undefined;
            //domainDetails = undefined;
            this.getUsers(accountId, function (data) {
                userDetails = data;
                if ((userDetails.length != 0) && (domainDetails.length != 0)) {
                    _this.mergeAccountAndUsers(accountId, function () {
                        callbackForView(accountDomainDetails[accountId]);
                    });
                }
            });
            this.getAccounts(accountId, function (data) {
                domainDetails = data;
                if ((userDetails.length != 0) && (domainDetails.length != 0)) {
                    _this.mergeAccountAndUsers(accountId, function () {
                        callbackForView(accountDomainDetails[accountId]);
                    });
                }
            });
        }
        else {
            callbackForView(accountDomainDetails[accountId]);
        }
    };
}])
.service('stoneViewService', ['domainAccountService', 'domainNamesConfig',
function (domainAccountService, domainNamesConfig) {

    this.getDomainNames = function (callback) {
        domainNamesConfig.getDomainNames(
            function (data) {
                callback(data);
            },
            function (err) {
                console.log(err);
            });
    };
    this.getAccountDetails = function (accountId, callback) {
        if (accountId != undefined && accountId != '00000000-0000-0000-0000-000000000000') {
            domainAccountService.accountForView(accountId, function (data) {
                callback(data);
            });
        }
    };
}]);
