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