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