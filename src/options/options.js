;(function(angular,chrome) {
	'use strict';
	angular.module("optionsApp", ['ui.bootstrap'])
	.controller("optionsCtrl",["$scope","$q","$filter",function($scope,$q,$filter) {
		$scope.toDayString = function(date){
			var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			return weekday[(new Date(date)).getDay()];
		};
		$scope.addBookingPreference = function() {
       		$scope.travelPlan.preference.push({trainNum:"", class:""});
        };
	    $scope.deleteBookingPreference = function(index) {
        	if($scope.travelPlan.preference.length > 1 && index >= 0 && index < $scope.travelPlan.preference.length) {
	        	$scope.travelPlan.preference.splice(index,1);
        	}
        };
	    $scope.saveTravelPlan = function(createNew){
	        chrome.extension.sendRequest({method: "saveTravelPlan", 
	           data:$scope.travelPlan, currentTravelPlan:$scope.travelPlanList.currentTravelPlan}, 
	           function(response) {
   				$scope.getTravelPlan(createNew);
	           });
        };
        $scope.deleteTravelPlan = function() {
        	chrome.extension.sendRequest({method: "deleteTravelPlan", 
	           data:$scope.travelPlan}, 
	           function(response) {
   				$scope.getTravelPlan(false);
	           });
        };
        $scope.getTravelPlan = function(createNew){
        	chrome.extension.sendRequest({method:"getTravelPlan",createNew:createNew},
	    		function(response){
	    			var travelPlan = response.travelPlan;
	    			var appConfig = response.appConfig;
	    			var travelPlanList = response.travelPlanList;
	    			var index1, index2;
	    			//Fix select option objects for ===
	    			/*for(index1 = 0;  index1 < appConfig.length; index1 += 1) {
    					if(appConfig[index1].control === "select") {
    						for(index2 = 0; index2 < appConfig[index1].options.length; index2 += 1) {
    							//TBD Looks like angular bug. Fix it..
    							if(angular.equals(travelPlan[appConfig[index1].key], appConfig[index1].options[index2])) {
    								travelPlan[appConfig[index1].key] = appConfig[index1].options[index2];
    								break;
    							}
    						}
    					}
	    			}
	    			*/
	    			$scope.travelPlan = travelPlan;
	    			$scope.appConfig = appConfig;
	    			$scope.travelPlanList = travelPlanList;
	    			$scope.stationName = stationName;
	    			$scope.$apply();
    		});
	    };
	    $scope.resetAll = function() {
	    	chrome.extension.sendRequest({method: "resetAll"}, 
	           function() {
				$scope.getTravelPlan(true);
	           });
	    };
	    $scope.startBooking = function() {
	    	$scope.saveTravelPlan(false);
	    	chrome.tabs.create({url:"https://www.irctc.co.in/"});
	    };
	    $scope.getTravelPlan(false);
	}]);
})(angular,chrome);