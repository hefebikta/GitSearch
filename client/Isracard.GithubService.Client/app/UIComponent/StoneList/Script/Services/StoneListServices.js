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
