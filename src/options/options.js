;(function(angular,chrome) {
	'use strict';
	angular.module("optionsApp",[])
	.controller("optionsCtrl",["$scope","$q",function($scope,$q) {
		$scope.travelPlanInfo = [
		{name:"User Id",value:"foo123",placeholder:"User Id",type:"text"},
		{name:"Password",value:"foo456",placeholder:"Password",type:"password"}
		];
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