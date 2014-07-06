;(function(angular) {
	angular.module("optionsApp",[])
	.controller("optionsCtrl",["$scope",function($scope) {
	 $scope.userId = "chetanreva";
	 $scope.password = "password";
	 $scope.travelPlan = {
	 	"userId":"chetanreva",
	 	"password" : " password"
		}
	}]);
})(angular);