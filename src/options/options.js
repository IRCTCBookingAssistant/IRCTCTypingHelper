;(function(angular,chrome) {
	'use strict';
	angular.module("optionsApp", ['ui.bootstrap'])
	.controller("optionsCtrl",["$scope","$q","$filter",function($scope,$q,$filter) {
		$scope.toDayString = function(date){
			var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			return weekday[(new Date(date)).getDay()];
		};
		$scope.saveTravelPlan = function(){
	        chrome.extension.sendRequest({method: "saveTravelPlan", 
	           data:$scope.travelPlan}, 
	           function(response) {});
        };
	    $scope.getTravelPlan = function(){
	    	chrome.extension.sendRequest({method:"getTravelPlan"},
	    		function(response){
	    			var travelPlan = response.travelPlan;
	    			var appConfig = response.appConfig;
	    			var index1, index2;
	    			//Fix select option objects for ===
	    			for(index1 = 0;  index1 < appConfig.length; index1 += 1) {
    					if(appConfig[index1].control === "select") {
    						for(index2 = 0; index2 < appConfig[index1].options.length; index2 += 1) {
    							//TBD Looks like angular bug. Fix it..
    							if(angular.equals(travelPlan[appConfig[index1].key].val, appConfig[index1].options[index2])) {
    								travelPlan[appConfig[index1].key].val = appConfig[index1].options[index2];
    								break;
    							}
    						}
    					}
	    			}
	    			$scope.travelPlan = travelPlan;
	    			$scope.appConfig = appConfig;
	    			$scope.stationName = stationName;
	    			$scope.$apply();
    		});
	    };
	    $scope.getTravelPlan();
	}]);
})(angular,chrome);