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