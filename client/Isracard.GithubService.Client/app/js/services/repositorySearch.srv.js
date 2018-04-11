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