(function () {
    "use strict";

    function modelDateFilter() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function (data) {
                    //convert data from view format to model format
                    return data; //converted
                });

                ngModelController.$formatters.push(function (data) {
                    //convert data from model format to view format
                    var d = new Date(data);
                    return d; //converted
                });
            }
        }
    }

    angular.module("StoneService.Directives").directive('modelDateFilter', modelDateFilter);


})();