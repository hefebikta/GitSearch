(function () {
	"use strict";
	function getdisplayvalue() {
		return function(val, gradesList) {
			if (val && gradesList) {
				var lowerCaseVal = val.replace(/(\*|\s+|\s|\\|\"|\t|\r|\n|-|–|_|\/)/g, "").toLowerCase();
				var res = gradesList.filter(function(g) {
					return g.name.toLowerCase() === lowerCaseVal;
				});
				if (res && res.length > 0)
					return res[0]["default-display"];
				else
					return val;
			}
			return val;
		};
	}
	angular.module("StoneService.Filters").filter("getdisplayvalue", getdisplayvalue);
})();