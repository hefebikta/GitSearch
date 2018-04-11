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