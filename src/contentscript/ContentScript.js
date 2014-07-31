;(function(angular,chrome,$) {
	'use strict';
	chrome.extension.sendRequest({method:"getTravelPlan"},
		function(response){
			var travelPlan = response.travelPlan;
			var appConfig = response.appConfig;
			var ctrlMap = response.ctrlMap;
			var pageDriver = response.pageDriver;
			var index1;

			var findTrainSearch = function() {
                var allTrains = $("#avlAndFareForm").find("a");
                var index1;
                var target;
                for(index1 = 0; index1 < allTrains.length; index1 += 1 ) {
                    // availFareEnq(this,'12051','Wed Jul 30 00:00:00 IST 2014','CC','DR','MAO',true)
                    if($(allTrains[index1]).attr("onclick").search("availFareEnq[(]this,'"+travelPlan.trainNum.val+"'" ) !== -1) {
                        target = allTrains[index1];
                        break;
                    }
                }
                if(angular.isUndefined(target)) {
                    alert("Train Not Found. Please verify the travel plan.");
                }
                return target;
            };

			var findTarget = function(targetKey, callback) {
				var target;
				if(location.pathname === targetKey.url) {
					if(angular.isDefined(targetKey.id)) {
						target = $("#"+targetKey.id);
					}
					else  if(angular.isDefined(targetKey.name)){
						target = $("input[name='" + targetKey.name + "']");
					}
					else if(angular.isDefined(targetKey.searchCallback)) {
						if(targetKey.searchCallback === "findTrain") {
							target = findTrainSearch();
						}
					}
					callback(target);
				}
				return target;
			};

			var assignAttrib = function(targetKey, attrName, attrVal) {
				findTarget(targetKey, function(target) {
					target.attr(attrName, attrVal);
				});
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

		    // move to next form
		    for(index1=0; index1 < pageDriver.length; index1 += 1) {
		    	findTarget(pageDriver[index1], function(target){
		    		target.click();
		    	});
		    }
		});
})(angular,chrome,jQuery);