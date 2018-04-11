'use strict';
stoneListApp.controller('stoneListCtrl', ['$scope', '$filter', 'stoneListService', '$rootScope', '$timeout',
    function ($scope, $filter, stoneListService, $rootScope, $timeout) {
        $scope.stoneStates = {
            "Valid": 0,
            "NotValidUser": 1,
            "Error": 2,
            "StoneRejects": 3,
            "Progress": 4,
            "StoneWithoutReports": 5
        };

        $scope.pasteAreaPlaceHolder = function () {
            if ($scope.idTypeSelected)
                return $scope.idTypeSelected.placeHolder;
            return undefined;
        };

        $scope.searchBy = function () {
            if ($scope.idTypeSelected)
                return $scope.idTypeSelected.searchBy;
            return 'stone';
        };

        $scope.loading = {};
        $scope.loading.check = false;

        //ctor
        $scope.initialize = function () {
            $scope.UserID = '';
            //in case stones or account is not provided.

            if ($scope.stones === undefined)
                $scope.stones = [];

            if ($rootScope.selectedStones)
                $scope.handleStoneIds($rootScope.selectedStones);
        };

        var getStonesByIds = function (stoneIds) {

            $scope.getStones(stoneIds, function (unifiedStones) {
                angular.forEach(unifiedStones, function (uniStone) {
                    if ($scope.searchBy() == 'stock')
                        uniStone = $scope.getStoneBySelectedAccount(uniStone);


                    if (uniStone.state == undefined || uniStone.state == null) {
                        uniStone.state = $scope.stoneStates.Progress;
                        $scope.validateStone(uniStone);
                    }
                    if (uniStone.userInput != undefined && uniStone.userInput.stockId != undefined) {
                        uniStone.userInput.stockId = uniStone.userInput.stockId.replace("\n", " ");
                        if (uniStone.userInput.stockId.length > 25) {
                            uniStone.userInput.stockId = uniStone.userInput.stockId.substring(0, 25);
                        }
                    }
                    if ($scope.searchBy() == 'stone') {
                        if ($scope.stones.filter(function (stone) { return stone.friendlyName == uniStone.friendlyName; }).length > 0)
                            console.warn('Stone already exist in list -> ' + uniStone.stoneFriendly);
                        else
                            $scope.stones.push(uniStone);
                    } else {
                        if ($scope.stones.filter(function (stone) { return stone.userInput && uniStone.userInput && stone.userInput.stockId === uniStone.userInput.stockId ; }).length > 0)
                            console.warn('Stone StockId already exist in list -> ' + uniStone.userInput.stockId);
                        else
                            $scope.stones.push(uniStone);
                    }

                });
                // when finish loading stones
                $timeout(function () {
                    $scope.finishedLoading();
                }, 100);
            });

        };

        $scope.stoneRejectsList = function (stone) {
            var rejectList = "";
            angular.forEach(stone.RejectsTemplateDependency, function (reject, index) {
                rejectList += reject.Description + "\n";
            });
            return rejectList;
        };

        //remove and return all valid stones
        $scope.removeStones = function () {
            var validStones = $scope.stones.filter(function (stone) { return stone.state === $scope.stoneStates.Valid; });
            $scope.stones = $scope.stones.filter(function (stone) { return stone.state !== $scope.stoneStates.Valid; });
            return validStones;
        };

        ///Filters
        $scope.filterNumValid = function () {
            return $scope.stones.filter(function (stone) { return stone.state === $scope.stoneStates.Valid; }).length;
        }

        $scope.filterNumInvalid = function () {
            return $scope.stones.filter(function (stone) { return stone.state !== $scope.stoneStates.Valid && stone.state !== $scope.stoneStates.StoneRejects; }).length;
        }

        $scope.filterNumRejects = function () {
            return $scope.stones.filter(function (stone) { return stone.state === $scope.stoneStates.StoneRejects; }).length;
        }

        $scope.filterNumValidRejects = function () {
            return $scope.stones.filter(function (stone) { return stone.state === $scope.stoneStates.Valid || stone.state === $scope.stoneStates.StoneRejects; }).length;
        }

        //ng-Paste func handler
        $scope.pasteStones = function (pasteEvent) {
            if ($scope.disablePasteEvent === true)
                return;

            if (pasteEvent.target.id === 'SearchText')
                return;

            var pasteData = pasteEvent.originalEvent.clipboardData.getData('text/plain');
            var regX = /\r\n|\r|\n/g;
            var stoneList = pasteData.split(regX);
            $scope.handleStoneIds(stoneList);
        };

        $scope.handleStoneIds = function (stoneIds) {
            if (stoneIds && stoneIds.length > 0) {
                $scope.loading = {};
                $scope.loading.check = true;
                stoneIds = stoneIds.filter(function (id) { return id != "" });
                getStonesByIds(stoneIds);
            }
        };

        $scope.$on('onIdTypeChanged', function (event, stoneIds, selectedType) {
            $scope.idTypeSelected = selectedType;
            $scope.stones = [];
            $scope.handleStoneIds(stoneIds);
        });

        $scope.$watch('stones', function (newVal) {
        }, true);

        $scope.finishedLoading = function () {
            $scope.loading.check = false;
        };

        $scope.showLoading = function () {
            return $scope.loading.check === true;
        };

        ///List removers
        $scope.removeAll = function () {
            if ($scope.searchBy() == 'stock') {
                var stockIds = [];
                $scope.stones.forEach(function (stone) {
                    stockIds.push(stone.userInput.stockId);
                });
                $scope.removeStonesByStock(stockIds);
            }
            $scope.stones = [];
        };

        $scope.removeNotValid = function () {
            if ($scope.searchBy() == 'stock') {
                var stockIds = [];
                $scope.stones.forEach(function (stone) {
                    if (stone.state != $scope.stoneStates.Valid)
                        stockIds.push(stone.userInput.stockId);
                });
                $scope.removeStonesByStock(stockIds);
            }
            $scope.stones = $scope.stones.filter(function (stone) { return stone.state === $scope.stoneStates.Valid; });

        };

        $scope.removeStone = function (stone) {
            if ($scope.searchBy() == 'stock') {
                var stockIds = [];
                stockIds.push(stone.userInput.stockId);
                $scope.removeStonesByStock(stockIds);
                $scope.stones = $scope.stones.filter(function (elem) {
                    return elem.userInput.stockId !== stone.userInput.stockId;
                });

            }
            else {
                $scope.stones = $scope.stones.filter(function (elem) {
                    return elem.friendlyName !== stone.friendlyName;
                });
            }
        };

        $scope.removeRejects = function () {
            if ($scope.searchBy() == 'stock') {
                var stockIds = [];
                $scope.stones.forEach(function (stone) {
                    if (stone.state === $scope.stoneStates.StoneRejects)
                        stockIds.push(stone.userInput.stockId);
                });
                $scope.removeStonesByStock(stockIds);
            }

            $scope.stones = $scope.stones.filter(function (stone) { return stone.state != $scope.stoneStates.StoneRejects; });
        };

        //get stones from server
        $scope.getStones = function (stoneIds, callback) {
            // get By FriendlyName
            if ($scope.searchBy() == 'stone') {
                stoneListService.bulkGetStoneByFriendly(stoneIds, 
                    function (uniStone) {
                        callback(uniStone);
                    },
                    function (error) {
                        var stones = [];
                        angular.forEach(stoneIds, function (stoneId) {
                            var notFoundStone = {
                                friendlyName: stoneId,
                                state: $scope.stoneStates.Error,
                                userInput: {
                                    stockId: ''
                                },
                                error: error
                            }
                            stones.push(notFoundStone);
                        });
                        callback(stones);
                    });
            } else {
                stoneListService.bulkGetStoneByStock($rootScope.accountId, stoneIds,
                    function (uniStone) {
                        callback(uniStone);
                    },
                    function (error) {
                        var stones = [];
                        angular.forEach(stoneIds, function (stoneId) {
                            var notFoundStone = {
                                friendlyName: '',
                                state: $scope.stoneStates.Error,
                                userInput: {
                                    stockId: stoneId
                                },
                                error: error
                            }
                            stones.push(notFoundStone);
                        });
                        callback(stones);
                    });
            }
        };

        //Copy Stone Id to clipboard.
        $scope.copyToClipboard = function (element) {
            var aux = document.createElement("input");
            aux.setAttribute("value", element);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            //window.prompt("Copied to clipboard: ", element); // Promt to popup window.
            document.body.removeChild(aux);
        };

        //export all stones from repository to csv file
        $scope.exportStonesListViewData = function () {
            var csvData = [];
            for (var i = 0; i < $scope.stones.length; i++) {
                var stone = $scope.stones[i];
                if (stone.light !== undefined) {
                    var row = {
                        a: stone.stoneId,
                        b: stone.friendlyName,
                        c: stone.userInput.stockId !== undefined ? stone.userInput.stockId : '',
                        d: stone.userInput.shape,
                        e: stone.userInput.carat,
                        f: $scope.getState(stone.state)
                    };
                    if ($scope.detailesToDisplay && $scope.detailesToDisplay.reports)
                        row.g = stone.reports;
                }
                else {
                    var row = {
                        a: '',
                        b: stone.friendlyName,
                        c: stone.userInput == undefined ? '' : stone.userInput.stockId !== undefined ? stone.userInput.stockId : '',
                        d: '',
                        e: '',
                        f: $scope.getState(stone.state)
                    };
                }
                csvData.push(row);
            }
            return csvData;
        };

        $scope.exportStonesListViewHeader = function () {
            var headers = [
                "Stone Id",
                "Friendly Name",
                "Stock Id",
                "Shape",
                "Carat",
                "State"
            ];
            if ($scope.detailesToDisplay && $scope.detailesToDisplay.reports)
                headers.push("Reports");
            return headers;
        };

        $scope.getState = function (state) {
            return getKeyByValue($scope.stoneStates, state);
        }

        ///    ******    Privare functions    *******

        var getKeyByValue = function (obj, value) {
            return Object.keys(obj).filter(function (key) { return obj[key] === value })[0];
        }

        // initialize controller
        $scope.initialize();
    }]);
