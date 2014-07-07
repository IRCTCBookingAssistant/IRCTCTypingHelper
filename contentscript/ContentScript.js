;(function(angular,chrome) {
	"use strict";
	chrome.extension.sendRequest({method:"getTravelPlan"},
		(function(response){
			$("#loginFormId").attr("ng-controller","loginCtrl");
			$("#usernameId").attr("ng-model","response.userId")
			//$("#usernameId").val(response.userId);
			angular.module('booking', [])
			  .controller('loginCtrl', function($scope) {
			      $scope.response = response;
			  });
		    angular.bootstrap(document, ['booking']);
		}));
})(angular,chrome);