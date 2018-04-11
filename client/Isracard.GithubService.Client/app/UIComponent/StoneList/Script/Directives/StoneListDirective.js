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



