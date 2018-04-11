(function() {
    "use strict";

    function points3Format($filter) {
        return {
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) return;


                ctrl.$formatters.unshift(function (a) {
                    return $filter(attrs.points3Format)(ctrl.$modelValue);
                });

                elem.on('blur', function () {
                    scope.$apply(function (e) {
                        var point = ctrl.$viewValue.indexOf(".");
                        //check if the rgexp ok and the input value small then .000 -  put .000 
                        if ((point === -1 || ctrl.$viewValue.length < point + 4)) {
                            ctrl.$viewValue = $filter(attrs.points3Format)(ctrl.$modelValue);
                            ctrl.$render();
                        }
                    });
                });
            }
        }
    }


    points3Format.$inject = ['$filter'];

    angular.module("StoneService.Directives").directive('points3Format', points3Format);




})();