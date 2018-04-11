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