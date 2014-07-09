;(function(angular,chrome) {
	'use strict';
	angular.module("optionsApp",[])
	.controller("optionsCtrl",["$scope","$q",function($scope,$q) {
		$scope.travelPlan = {
		 	"userId":"chetanreva",
		 	"password" : " password"
			};
		$scope.saveTravelPlan = function(){
	        chrome.extension.sendRequest({method: "saveTravelPlan", 
	           data:$scope.travelPlan}, 
	           function(response) {});
        };
	    $scope.getTravelPlan = function(){
	    	chrome.extension.sendRequest({method:"getTravelPlan"},
	    		function(response){
	    			$scope.travelPlan = response;
	    			$scope.$apply();
    		});
	    };
	}]);
})(angular,chrome);