;(function(angular,chrome,$) {
	'use strict';
	chrome.extension.sendRequest({method:"getTravelPlan"},
		function(response){
			var travelPlan = response.travelPlan;
			var appConfig = response.appConfig;
			var ctrlMap = response.ctrlMap;
			var index1;

			var assignAttrib = function(targetKey, attrName, attrVal) {
				var target;
				if(location.pathname === targetKey.url) {
					if(angular.isDefined(targetKey.id)) {
						target = $("#"+targetKey.id);
					}
					else {
						target = $("input[name='" + targetKey.name + "']");
					}
					target.attr(attrName, attrVal); 
				}
			};

			var toTravelDate = function(dateStr) {
	        	var dateVal = new Date(dateStr);
	        	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	        	return (String(dateVal.getDate() + 100).slice(1) + "-" + months[dateVal.getMonth()] + "-" + dateVal.getFullYear());
	        };

			for(index1 = 0; index1 < ctrlMap.length; index1 += 1) {
				assignAttrib(ctrlMap[index1],"ng-controller","pageCtrl");
			}

			for(index1 = 0; index1 < appConfig.length; index1 += 1) {
				if(appConfig[index1].control === 'input' && appConfig[index1].type === 'date') {
					travelPlan[appConfig[index1].key].val = toTravelDate(travelPlan[appConfig[index1].key].val);
				}
				assignAttrib(appConfig[index1],"ng-model","travelPlan['" + appConfig[index1].key + "'].val");
			}

			angular.module('booking', [])
			  .controller('pageCtrl', function($scope) {
			      $scope.travelPlan = travelPlan;
			  });
		    angular.bootstrap(document, ['booking']);
		});
})(angular,chrome,jQuery);