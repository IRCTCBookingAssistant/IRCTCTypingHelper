;(function(angular,chrome) {
	'use strict';
	angular.module("optionsApp",[])
	.controller("optionsCtrl",["$scope","$q",function($scope,$q) {
		/*$scope.travelPlan = {
		   userid: {val:"foo123"},
		   pwd: {val:"foo456"}
		};*/
		$scope.appConfig = [
			{key:"userid", displayName:"User Id",placeholder:"User Id",type:"text",id:"usernameId",name:"j_username"},
			{key:"pwd",displayName:"Password",placeholder:"Password",type:"password",id:"",name:"j_password"}
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
	    $scope.getTravelPlan();
	}]);
})(angular,chrome);