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