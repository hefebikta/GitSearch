VERSION={"version":"1.0.0.0"} 
//prepare for orinting
var winQR, winBC;

function printIt(printThis) {
    var htmlString = '';
    htmlString += '<html><head>\n';
    htmlString += '<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>\n';
    htmlString += '<script>\n';
    htmlString += 'var beforePrint = function() {\n';
    htmlString += '};\n';
    htmlString += 'var afterPrint = function() {\n';
    htmlString += '   window.close();\n';
    htmlString += '};\n';
    htmlString += 'var is_chrome = function () { return Boolean(window.chrome); }\n';
    htmlString += 'if(is_chrome()){\n';
    htmlString += '   window.matchMedia(\'print\').addListener(function(media) {\n';
    htmlString += '      if (media.matches) {\n';
    htmlString += '         beforePrint();\n';
    htmlString += '      } else {\n';
    htmlString += '         $(document).one(\'mouseover\', afterPrint);\n';
    htmlString += '      }\n';
    htmlString += '   });\n';
    htmlString += '} else {\n';
    htmlString += '   $(window).on(\'beforeprint\', beforePrint);\n';
    htmlString += '   $(window).on(\'afterprint\', afterPrint);\n';
    htmlString += '}\n';
    htmlString += '$(window).load(function() {\n';
    htmlString += '   window.print();\n';
    htmlString += '});\n';
    htmlString += '</script>\n';
    htmlString += '<style>body, td { font-family: Verdana; font-size: 10pt; padding:10px; }</style>\n';
    htmlString += '</head><body>\n';

    if (printThis.toString().indexOf("QR") != -1) {
        if (winQR) {
            winQR.close();
            winQR = null;
        }
        winQR = window.open();
        self.focus();
        winQR.document.open();
        winQR.document.write(htmlString);
        winQR.document.write(printThis + '\n');
        winQR.document.write('</br></body></html>\n');
        winQR.document.close();
    } else {
        if (winBC) {
            winBC.close();
            winBC = null;
        }
        winBC = window.open();
        self.focus();
        winBC.document.open();
        winBC.document.write(htmlString);
        winBC.document.write(printThis);
        winBC.document.write('</br></body></html>');
        winBC.document.close();
    }
}

$(window).on('beforeunload', function () {
    if (winBC) {
        winBC.close();
        winBC = null;
    }
    if (winQR) {
        winQR.close();
        winQR = null;
    }
});
var domainAccountApp = angular.module('domainAccountApp', ['domainAccountApp.directives', 'domainAccountApp.services']);

var stoneListApp = angular.module('stoneListApp', ['stoneListApp.directives', 'stoneListApp.services', 'ngSanitize', 'ngCsv', 'StoneService.Filters', 'StoneService.Services']);
(function () {
    "use strict";
    function bookmark($resource, env) {
        return $resource(env.SERVER_URL + "/bookmark",
            {},
            {
                save: {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json"
                    }
                },
                query: {
                    method: "GET",
                    isArray: true
                }
            });
    }

    bookmark.$inject = ["$resource", "ENV"];

    angular.module("StoneService.Services").factory("Bookmark", bookmark);

})();
(function () {
    "use strict";
    function repositorySearch($resource, env) {
        return $resource(env.GITHUB_URL + "/search/repositories?q=:query",
            {
                query: "@query"
            },
            {
                get: {
                    method: "GET"
                }
            });
    }
    repositorySearch.$inject = ["$resource", "ENV"];
    angular.module("StoneService.Services").factory("RepositorySearch", repositorySearch);

})();
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

(function(window, document) {

// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('ngCsv.config', []).
  value('ngCsv.config', {
      debug: true
  }).
  config(['$compileProvider', function($compileProvider){
    if (angular.isDefined($compileProvider.urlSanitizationWhitelist)) {
      $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
    } else {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
    }
  }]);

// Modules
angular.module('ngCsv.directives', ['ngCsv.services']);
angular.module('ngCsv.services', []);
angular.module('ngCsv',
    [
        'ngCsv.config',
        'ngCsv.services',
        'ngCsv.directives',
        'ngSanitize'
    ]);
/**
 * Created by asafdav on 15/05/14.
 */
angular.module('ngCsv.services').
  service('CSV', ['$q', function ($q) {

    var EOL = '\r\n';
    var BOM = "\ufeff";

    var specialChars = {
      '\\t': '\t',
      '\\b': '\b',
      '\\v': '\v',
      '\\f': '\f',
      '\\r': '\r'
    };

    /**
     * Stringify one field
     * @param data
     * @param options
     * @returns {*}
     */
    this.stringifyField = function (data, options) {
      if (options.decimalSep === 'locale' && this.isFloat(data)) {
        return data.toLocaleString();
      }

      if (options.decimalSep !== '.' && this.isFloat(data)) {
        return data.toString().replace('.', options.decimalSep);
      }

      if (typeof data === 'string') {
        data = data.replace(/"/g, '""'); // Escape double qoutes

        if (options.quoteStrings || data.indexOf(',') > -1 || data.indexOf('\n') > -1 || data.indexOf('\r') > -1) {
            data = options.txtDelim + data + options.txtDelim;
        }

        return data;
      }

      if (typeof data === 'boolean') {
        return data ? 'TRUE' : 'FALSE';
      }

      return data;
    };

    /**
     * Helper function to check if input is float
     * @param input
     * @returns {boolean}
     */
    this.isFloat = function (input) {
      return +input === input && (!isFinite(input) || Boolean(input % 1));
    };

    /**
     * Creates a csv from a data array
     * @param data
     * @param options
     *  * header - Provide the first row (optional)
     *  * fieldSep - Field separator, default: ',',
     *  * addByteOrderMarker - Add Byte order mark, default(false)
     * @param callback
     */
    this.stringify = function (data, options) {
      var def = $q.defer();

      var that = this;
      var csv = "";
      var csvContent = "";

      var dataPromise = $q.when(data).then(function (responseData) {
        //responseData = angular.copy(responseData);//moved to row creation
        // Check if there's a provided header array
        if (angular.isDefined(options.header) && options.header) {
          var encodingArray, headerString;

          encodingArray = [];
          angular.forEach(options.header, function (title, key) {
            this.push(that.stringifyField(title, options));
          }, encodingArray);

          headerString = encodingArray.join(options.fieldSep ? options.fieldSep : ",");
          csvContent += headerString + EOL;
        }

        var arrData = [];

        if (angular.isArray(responseData)) {
          arrData = responseData;
        }
        else if (angular.isFunction(responseData)) {
          arrData = responseData();
        }

        angular.forEach(arrData, function (oldRow, index) {
          var row = angular.copy(arrData[index]);
          var dataString, infoArray;

          infoArray = [];

          angular.forEach(row, function (field, key) {
            this.push(that.stringifyField(field, options));
          }, infoArray);

          dataString = infoArray.join(options.fieldSep ? options.fieldSep : ",");
          csvContent += index < arrData.length ? dataString + EOL : dataString;
        });

        // Add BOM if needed
        if (options.addByteOrderMarker) {
          csv += BOM;
        }

        // Append the content and resolve.
        csv += csvContent;
        def.resolve(csv);
      });

      if (typeof dataPromise['catch'] === 'function') {
        dataPromise['catch'](function (err) {
          def.reject(err);
        });
      }

      return def.promise;
    };

    /**
     * Helper function to check if input is really a special character
     * @param input
     * @returns {boolean}
     */
    this.isSpecialChar = function(input){
      return specialChars[input] !== undefined;
    };

    /**
     * Helper function to get what the special character was supposed to be
     * since Angular escapes the first backslash
     * @param input
     * @returns {special character string}
     */
    this.getSpecialChar = function (input) {
      return specialChars[input];
    };


  }]);
/**
 * ng-csv module
 * Export Javascript's arrays to csv files from the browser
 *
 * Author: asafdav - https://github.com/asafdav
 */
angular.module('ngCsv.directives').
  directive('ngCsv', ['$parse', '$q', 'CSV', '$document', '$timeout', function ($parse, $q, CSV, $document, $timeout) {
    return {
      restrict: 'AC',
      scope: {
        data: '&ngCsv',
        filename: '@filename',
        header: '&csvHeader',
        txtDelim: '@textDelimiter',
        decimalSep: '@decimalSeparator',
        quoteStrings: '@quoteStrings',
        fieldSep: '@fieldSeparator',
        lazyLoad: '@lazyLoad',
        addByteOrderMarker: "@addBom",
        ngClick: '&',
        charset: '@charset'
      },
      controller: [
        '$scope',
        '$element',
        '$attrs',
        '$transclude',
        function ($scope, $element, $attrs, $transclude) {
          $scope.csv = '';

          if (!angular.isDefined($scope.lazyLoad) || $scope.lazyLoad != "true") {
            if (angular.isArray($scope.data)) {
              $scope.$watch("data", function (newValue) {
                $scope.buildCSV();
              }, true);
            }
          }

          $scope.getFilename = function () {
            return $scope.filename || 'download.csv';
          };

          function getBuildCsvOptions() {
            var options = {
              txtDelim: $scope.txtDelim ? $scope.txtDelim : '"',
              decimalSep: $scope.decimalSep ? $scope.decimalSep : '.',
              quoteStrings: $scope.quoteStrings,
              addByteOrderMarker: $scope.addByteOrderMarker
            };
            if (angular.isDefined($attrs.csvHeader)) options.header = $scope.$eval($scope.header);


            options.fieldSep = $scope.fieldSep ? $scope.fieldSep : ",";

            // Replaces any badly formatted special character string with correct special character
            options.fieldSep = CSV.isSpecialChar(options.fieldSep) ? CSV.getSpecialChar(options.fieldSep) : options.fieldSep;

            return options;
          }

          /**
           * Creates the CSV and updates the scope
           * @returns {*}
           */
          $scope.buildCSV = function () {
            var deferred = $q.defer();

            $element.addClass($attrs.ngCsvLoadingClass || 'ng-csv-loading');

            CSV.stringify($scope.data(), getBuildCsvOptions()).then(function (csv) {
              $scope.csv = csv;
              $element.removeClass($attrs.ngCsvLoadingClass || 'ng-csv-loading');
              deferred.resolve(csv);
            });
            $scope.$apply(); // Old angular support

            return deferred.promise;
          };
        }
      ],
      link: function (scope, element, attrs) {
        function doClick() {
          var charset = scope.charset || "utf-8";
          var blob = new Blob([scope.csv], {
            type: "text/csv;charset="+ charset + ";"
          });

          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, scope.getFilename());
          } else {

            var downloadLink = angular.element('<a></a>');
            downloadLink.attr('href', window.URL.createObjectURL(blob));
            downloadLink.attr('download', scope.getFilename());
            downloadLink.attr('target', '_blank');

            $document.find('body').append(downloadLink);
            $timeout(function () {
              downloadLink[0].click();
              downloadLink.remove();
            }, null);
          }
        }

        element.bind('click', function (e) {
          scope.buildCSV().then(function (csv) {
            doClick();
          });
          scope.$apply();
        });
      }
    };
  }]);
})(window, document);
'use strict';
angular.module('stoneListApp.services', ['ngResource'])
.factory('unifiedStoneAPI', ['$resource', function ($resource) {
    var cookie = OCCookies.getCookie('ACCESS_TOKEN');
    if (cookie === null)
        location.assign('/Account/Login?ReturnUrl=' + location.pathname);

    return $resource(ENV.SERVER_URL + ':ctrl/:version/:func', {
            ctrl: 'stone',
            version: 'v1',
        }, {
        getStoneByFriendly: {
            method: 'GET',
            headers: { ACCESS_TOKEN: cookie },
            params: {
                func: ''
            },
            isArray: false
        },
        getStoneByStock: {
            method: 'GET',
            headers: { ACCESS_TOKEN: cookie },
            params: {
                version: 'v2',
                func: 'bystockid'
            },
            isArray: true
        },
        bulkGetStoneByFriendly: {
            method: 'POST',
            headers: {
                ACCESS_TOKEN: cookie
            },
            params: {
                func: 'getByFriendlyNames'
            },
            isArray: true
        },
        bulkGetStoneByStock: {
            method: 'POST',
            headers: { ACCESS_TOKEN: cookie },
            params: {
                func: 'getByStockIds',
                ownerId: '@ownerId'
            },
            isArray: true
        }
    });
}])
.service('stoneListService', ['unifiedStoneAPI', function (unifiedStoneAPI) {

    //Bulk API to get stones by Friendly names
    this.bulkGetStoneByFriendly = function (stoneIds, callback, error) {
        unifiedStoneAPI.bulkGetStoneByFriendly(stoneIds,
            function (stones) {
                angular.forEach(stoneIds, function (stoneId) {
                    if (stones.filter(function (stone) { return stone.friendlyName === stoneId; }).length == 0) {
                        var notFoundStone = {
                            friendlyName: stoneId,
                            state: 2, // === $scope.stoneStates.Error,
                            userInput: {
                                stockId: ''
                            },
                            error: {
                                status: 404,
                                statusText: "Not Found"
                            }
                        }
                        stones.push(notFoundStone);
                    }
                });
                callback(stones);
            },
            function (err) {
                error(err);
            });
    };

    //Bulk API to get stones by Stock Ids
    this.bulkGetStoneByStock = function (ownerId, stoneIds, callback, error) {
        unifiedStoneAPI.bulkGetStoneByStock(ownerId, stoneIds, 
            function (stones) {
                angular.forEach(stoneIds, function (stoneId) {
                    if (stones.filter(function (stone) { return stone.userInput.stockId === stoneId; }).length == 0) {
                        var notFoundStone = {
                            friendlyName: '',
                            state: 2, // === $scope.stoneStates.Error,
                            userInput: {
                                stockId: stoneId
                            },
                            error: {
                                status: 404,
                                statusText: "Not Found"
                            }
                        }
                        stones.push(notFoundStone);
                    }
                });
                callback(stones);
            },
            function (err) {
                error(err);
            });
    };

    //Platform API to get stone
    this.getUnifiedStone = function (friendlyName, searchBy, callback, error) {
        if (friendlyName !== undefined && friendlyName !== "") {
            getUniStone(friendlyName, searchBy, callback, error);
        }
    };

    function getUniStone(searchKey, searchBy, callback, error) {

        if (searchBy == undefined || searchBy == 'stone') {
            unifiedStoneAPI.getStoneByFriendly({ friendlyName: searchKey },
                function (data) {
                    callback(data);
                },
                function (err) {
                    error(err);
                });
        } else {
            unifiedStoneAPI.getStoneByStock({ id: searchKey },
                function (data) {
                    callback(data);
                },
                function (err) {
                    error(err);
                });
        };
    };
}]);

(function () {
    "use strict";
    function rootCtrl($rootScope, $location, $http, env) {
    }
    angular.module("StoneService.Controllers").controller("RootCtrl", rootCtrl);
    rootCtrl.$inject = ["$rootScope", "$location", "$http","ENV"];
})();
(function () {
    "use strict";

    function repositoryListCtrl($rootScope,
        $scope,
        $timeout,
        $location,
        $filter,
        $route,
        prompt,
        dialogs,
        env,
        repositorySearch,
        bookmark) {
        console.log("enter sobaka");
        // Qurey bookmarks
        bookmark.query({},
            function(result) {
                $scope.bookmarkedRepositories = result;
                console.log("bookmarks got!");
                console.log(result.length);
            });

        $scope.search = function () {
            // Search github and requery bookmarks (maybe changed)
            repositorySearch.get({ query: $scope.query },
                function (repos) {
                    $scope.repositories = repos.items;
                    bookmark.query({},
                        function(result) {
                            $scope.bookmarkedRepositories = result;
                        });
                });
        };

        $scope.addBookmark = function(repository) {
            // Search & requery bookmarks (maybe changed)
            bookmark.save({},
                repository,
                function() {
                    bookmark.query({},
                        function(result) {
                            $scope.bookmarkedRepositories = result;
                        });
                });
        };
        $scope.isBookmarked = function (id) {
            // Check whether repository is bookmarked
            return $scope.bookmarkedRepositories.find(function(r) { return r.id === id; });
        }
        $scope.showBookmarks = function () {
            // show bookmarked repositories in modal dialog
            $rootScope.bookmarkModalInstance = dialogs.create("partials/bookMarkedList.html?___version___", "BookmarkListCtrl", {}, { keyboard: false, backdrop: "static", animation: true });
        };
    }
    
    angular.module("StoneService.Controllers").controller("RepositoryListCtrl", repositoryListCtrl);

    repositoryListCtrl.$inject = [
        "$rootScope", "$scope", "$timeout", "$location", "$filter", "$route", "prompt", "dialogs", "ENV", "RepositorySearch","Bookmark"
    ];
})();
(function () {
    "use strict";

    // just show bookmarked list, without dealing about add/remove functionality
    function bookmarkListCtrl($rootScope,
        $scope,
        $timeout,
        $location,
        $filter,
        $route,
        prompt,
        dialogs,
        env,
        bookmark) {
        console.log("enter sobaka");
        // query bookmarked instances
        bookmark.query({},
            function(result) {
                $scope.repositories = result;
            });
        $scope.close = function () {
            // close modal instance and return to base
            $rootScope.bookmarkModalInstance.close();
        };
    }
    
    angular.module("StoneService.Controllers").controller("BookmarkListCtrl", bookmarkListCtrl);

    bookmarkListCtrl.$inject = [
        "$rootScope", "$scope", "$timeout", "$location", "$filter", "$route", "prompt", "dialogs", "ENV","Bookmark"
    ];
})();
(function () {
    "use strict";

    function errorCtrl($scope, $timeout, $location, $routeParams) {
        $scope.action = $routeParams ? $routeParams.action : null;
    }

    angular.module("StoneService.Controllers").controller("ErrorCtrl", errorCtrl);

    errorCtrl.$inject = ["$scope", "$timeout", "$location", "$routeParams"];

})();
(function () {
    "use strict";
    function startWithTypeahead() {
        return function (items, props) {
            var out = [];
            if (angular.isArray(items)) {
                items.forEach(function (item) {

                    var text = props.toLowerCase();
                    var itemLoverCase = item.toLowerCase();
                    var substr = itemLoverCase.substr(0, text.length);

                    if (substr === text)
                        out.push(item);
                });
            } else {
                out = items;
            }
            return out;
        };
    }
    angular.module("StoneService.Filters").filter("startWithTypeahead", startWithTypeahead);
})();
(function () {
	"use strict";
	function getdisplayvalue() {
		return function(val, gradesList) {
			if (val && gradesList) {
				var lowerCaseVal = val.replace(/(\*|\s+|\s|\\|\"|\t|\r|\n|-|–|_|\/)/g, "").toLowerCase();
				var res = gradesList.filter(function(g) {
					return g.name.toLowerCase() === lowerCaseVal;
				});
				if (res && res.length > 0)
					return res[0]["default-display"];
				else
					return val;
			}
			return val;
		};
	}
	angular.module("StoneService.Filters").filter("getdisplayvalue", getdisplayvalue);
})();
(function () {
    "use strict";
    function points3() {
        return function (num) {
            if (num===0)
                return num.toFixed(3);
            if (!num)
                return null;
            if (num && angular.isNumber(num)) {
                return num.toFixed(3);
            }
            return 0;
        };
    }
    angular.module("StoneService.Filters").filter("points3", points3);
})();
(function () {
    "use strict";
    function attachmentStatus() {
        return function (attachment) {
            if (!attachment)
                return "";
            if (attachment.isValid)
                return "Exists";
            if(attachment.isUploading)
                return "Uploading";
            return "Uploaded";
        };
    }
    angular.module("StoneService.Filters").filter("attachmentStatus", attachmentStatus);
})();
(function () {
    "use strict";
    function caratpoints3() {
        return function (num) {
            if (num && angular.isNumber(num)) {
                return num.toFixed(3);
            }
            return "";
        };
    }
    angular.module("StoneService.Filters").filter("caratpoints3", caratpoints3);
})();
(function () {
    "use strict";
    function newlines() {
         return function (text) {
        if (text != undefined)
        { return text.replace(new RegExp('<br>', 'g'), ' '); }
        else { return text; }
    }
    }
    angular.module("StoneService.Filters").filter("newlines", newlines);
})();
(function() {
    "use strict";

    function points3Format($filter) {
        return {
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) return;


                ctrl.$formatters.unshift(function (a) {
                    return $filter(attrs.points3Format)(ctrl.$modelValue);
                });

                elem.on('blur', function () {
                    scope.$apply(function (e) {
                        var point = ctrl.$viewValue.indexOf(".");
                        //check if the rgexp ok and the input value small then .000 -  put .000 
                        if ((point === -1 || ctrl.$viewValue.length < point + 4)) {
                            ctrl.$viewValue = $filter(attrs.points3Format)(ctrl.$modelValue);
                            ctrl.$render();
                        }
                    });
                });
            }
        }
    }


    points3Format.$inject = ['$filter'];

    angular.module("StoneService.Directives").directive('points3Format', points3Format);




})();
(function () {
    "use strict";

    function mainHeader() {
        return {
            restrict: 'E',
            templateUrl: 'partials/header.html?___version___',
            replace: true,
            scope: true
        }
    }

    angular.module("StoneService.Directives").directive('mainHeader', mainHeader);

    
})();
(function () {
    "use strict";

    function modelDateFilter() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function (data) {
                    //convert data from view format to model format
                    return data; //converted
                });

                ngModelController.$formatters.push(function (data) {
                    //convert data from model format to view format
                    var d = new Date(data);
                    return d; //converted
                });
            }
        }
    }

    angular.module("StoneService.Directives").directive('modelDateFilter', modelDateFilter);


})();
(function () {
    "use strict";

    function customOnChange() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeHandler);
            }
        };
    }

    angular.module("StoneService.Directives").directive('customOnChange', customOnChange);


})();
/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 * https://github.com/vitalets/checklist-model
 * License: MIT http://opensource.org/licenses/MIT
 */

angular.module('checklist-model', [])
.directive('checklistModel', ['$parse', '$compile', function ($parse, $compile) {
    // contains
    function contains(arr, item, comparator) {
        if (angular.isArray(arr)) {
            for (var i = arr.length; i--;) {
                if (comparator(arr[i], item)) {
                    return true;
                }
            }
        }
        return false;
    }

    // add
    function add(arr, item, comparator) {
        arr = angular.isArray(arr) ? arr : [];
        if (!contains(arr, item, comparator)) {
            arr.push(item);
        }
        return arr;
    }

    // remove
    function remove(arr, item, comparator) {
        if (angular.isArray(arr)) {
            for (var i = arr.length; i--;) {
                if (comparator(arr[i], item)) {
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        return arr;
    }

    // http://stackoverflow.com/a/19228302/1458162
    function postLinkFn(scope, elem, attrs) {
        // exclude recursion, but still keep the model
        var checklistModel = attrs.checklistModel;
        attrs.$set("checklistModel", null);
        // compile with `ng-model` pointing to `checked`
        $compile(elem)(scope);
        attrs.$set("checklistModel", checklistModel);

        // getter / setter for original model
        var getter = $parse(checklistModel);
        var setter = getter.assign;
        var checklistChange = $parse(attrs.checklistChange);
        var checklistBeforeChange = $parse(attrs.checklistBeforeChange);

        // value added to list
        var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


        var comparator = angular.equals;

        if (attrs.hasOwnProperty('checklistComparator')) {
            if (attrs.checklistComparator[0] == '.') {
                var comparatorExpression = attrs.checklistComparator.substring(1);
                comparator = function (a, b) {
                    return a[comparatorExpression] === b[comparatorExpression];
                };

            } else {
                comparator = $parse(attrs.checklistComparator)(scope.$parent);
            }
        }

        // watch UI checked change
        scope.$watch(attrs.ngModel, function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }

            if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                scope[attrs.ngModel] = contains(getter(scope.$parent), value, comparator);
                return;
            }

            setValueInChecklistModel(value, newValue);

            if (checklistChange) {
                checklistChange(scope);
            }
        });

        function setValueInChecklistModel(value, checked) {
            var current = getter(scope.$parent);
            if (angular.isFunction(setter)) {
                if (checked === true) {
                    setter(scope.$parent, add(current, value, comparator));
                } else {
                    setter(scope.$parent, remove(current, value, comparator));
                }
            }

        }

        // declare one function to be used for both $watch functions
        function setChecked(newArr, oldArr) {
            if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                setValueInChecklistModel(value, scope[attrs.ngModel]);
                return;
            }
            scope[attrs.ngModel] = contains(newArr, value, comparator);
        }

        // watch original model change
        // use the faster $watchCollection method if it's available
        if (angular.isFunction(scope.$parent.$watchCollection)) {
            scope.$parent.$watchCollection(checklistModel, setChecked);
        } else {
            scope.$parent.$watch(checklistModel, setChecked, true);
        }
    }

    return {
        restrict: 'A',
        priority: 1000,
        terminal: true,
        scope: true,
        compile: function (tElement, tAttrs) {
            if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') && (tElement[0].tagName !== 'MD-CHECKBOX') && (!tAttrs.btnCheckbox)) {
                throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
            }

            if (!tAttrs.checklistValue && !tAttrs.value) {
                throw 'You should provide `value` or `checklist-value`.';
            }

            // by default ngModel is 'checked', so we set it if not specified
            if (!tAttrs.ngModel) {
                // local scope var storing individual checkbox model
                tAttrs.$set("ngModel", "checked");
            }

            return postLinkFn;
        }
    };
}]);
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

'use strict'
var stoneListAppDirectives = angular.module('stoneListApp.directives', []);
stoneListAppDirectives.directive('stoneList', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            removeStones: '=',
            removeStonesByStock: '=',
            disablePasteEvent: '=',
            onAccountChange: '=',        
            validateStone: '=',
            detailesToDisplay: '=',
            getStoneBySelectedAccount: '=',
            idTypeSelected: '=',
            stones: '='
        },
        controller: 'stoneListCtrl',
        templateUrl: 'UIComponent/StoneList/html/StoneListView.html'
    };
});




(function () {
    "use strict";
    function httpInterceptor($q, $location, ipCookie) {
        return {
        }
    }

    httpInterceptor.$inject = ['$q', '$location', 'ipCookie'];

    angular.module("StoneService.Http").factory("httpInterceptor", httpInterceptor);

})();

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