;(function(angular,chrome) {
	'use strict';
	angular.module("optionsApp",[])
	.controller("optionsCtrl",["$scope","$q","$filter",function($scope,$q,$filter) {
		var defaultDate = function() {
			var now = new Date();
			var nextday = new Date(now.getFullYear(), now.getMonth(), 
				now.getDate() + 1,0,now.getTimezoneOffset() * (-1),0,0);
			return $filter('date')(nextday, 'yyyy-MM-dd');
		};
		$scope.toDayString = function(date){
			var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			return weekday[(new Date(date)).getDay()];
		};
		var defaultTravelPlan = {
		   userid: {val:""},
		   pwd: {val:""},
		   from:{val:""},
		   to:{val:""},
		   date:{val: defaultDate()},
		   ticketType:{val:{value:"E_TICKET",label:"E-ticket"}}
		};
		$scope.appConfig = [
			{key:"userid", displayName:"User Id",placeholder:"User Id",control:"input",type:"text",id:"usernameId",name:"j_username"},
			{key:"pwd",displayName:"Password",placeholder:"Password",control:"input",type:"password",id:"",name:"j_password"},
			{key:"from",displayName:"From Station",placeholder:"From Station",control:"input",type:"text",id:"jpform:fromStation",name:"jpform:fromStation"},
			{key:"to",displayName:"To Station",placeholder:"To Station",control:"input",type:"text",id:"jpform:toStation",name:"jpform:toStation"},
			{key:"date",displayName:"Journey Date",placeholder:"Journey Date",control:"input",type:"date",id:"jpform:journeyDateInputDate",name:"jpform:journeyDateInputDate"},
			{key:"ticketType", displayName:"Ticket Type", control:"select",id:"jpform:ticketType",name:"jpform:ticketType",options:[{value:"E_TICKET",label:"E-ticket"},{value:"foo1",label:"foo2"}]}
		];
		$scope.saveTravelPlan = function(){
	        chrome.extension.sendRequest({method: "saveTravelPlan", 
	           data:$scope.travelPlan}, 
	           function(response) {});
        };
	    $scope.getTravelPlan = function(){
	    	chrome.extension.sendRequest({method:"getTravelPlan"},
	    		function(response){
	    			//var travelPlan = angular.extend(defaultTravelPlan,response);
	    			var travelPlan = defaultTravelPlan;
	    			var index1, index2;
	    			//Fix select option objects for ===
	    			for(index1 = 0;  index1 < $scope.appConfig.length; index1 += 1) {
    					if($scope.appConfig[index1].control === "select") {
    						for(index2 = 0; index2 < $scope.appConfig[index1].options.length; index2 += 1) {
    							if(travelPlan[$scope.appConfig[index1].key].val.value === $scope.appConfig[index1].options[index2].value) {
    								travelPlan[$scope.appConfig[index1].key].val = $scope.appConfig[index1].options[index2];
    								break;
    							}
    						}
    					}
	    			}
	    			$scope.travelPlan = travelPlan;
	    			$scope.$apply();
    		});
	    };
	    $scope.getTravelPlan();
	}]);
})(angular,chrome);