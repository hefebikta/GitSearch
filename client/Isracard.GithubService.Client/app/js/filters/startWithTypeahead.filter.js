(function () {
    "use strict";
    function startWithTypeahead() {
        return function (items, props) {
            var out = [];
            if (angular.isArray(items)) {
                items.forEach(function (item) {

                    var text = props.toLowerCase();
                    var itemLoverCase = item.toLowerCase();
                    var substr = itemLoverCase.substr(0, text.length);

                    if (substr === text)
                        out.push(item);
                });
            } else {
                out = items;
            }
            return out;
        };
    }
    angular.module("StoneService.Filters").filter("startWithTypeahead", startWithTypeahead);
})();