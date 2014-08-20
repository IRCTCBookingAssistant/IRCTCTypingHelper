(function (angular, chrome) {
    'use strict';
    angular.module("optionsApp", ['ui.bootstrap']).controller("optionsCtrl", [
        "$scope", "$q", "$filter", function ($scope, $q, $filter) {
            $scope.toDayString = function (date) {
                var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                return weekday[(new Date(date)).getDay()];
            };
            $scope.addBookingPreference = function () {
                $scope.travelPlan.preference.push({ trainNum: "", class: "" });
            };
            $scope.deleteBookingPreference = function (index) {
                if ($scope.travelPlan.preference.length > 1 && index >= 0 && index < $scope.travelPlan.preference.length) {
                    $scope.travelPlan.preference.splice(index, 1);
                }
            };
            $scope.addPassenger = function () {
                $scope.travelPlan.passenger.push({ psgName: "", psgBerth: "9", psgSenior: false });
            };
            $scope.deletePassenger = function (index) {
                if ($scope.travelPlan.passenger.length > 1 && index >= 0 && index < $scope.travelPlan.passenger.length) {
                    $scope.travelPlan.passenger.splice(index, 1);
                }
            };
            $scope.saveTravelPlan = function (createNew) {
                chrome.extension.sendRequest({
                    method: "saveTravelPlan",
                    data: $scope.travelPlan, currentTravelPlan: $scope.travelPlanList.currentTravelPlan }, function (response) {
                    $scope.getTravelPlan(createNew);
                });
            };
            $scope.deleteTravelPlan = function () {
                chrome.extension.sendRequest({
                    method: "deleteTravelPlan",
                    data: $scope.travelPlan }, function (response) {
                    $scope.getTravelPlan(false);
                });
            };
            $scope.getTravelPlan = function (createNew) {
                chrome.extension.sendRequest({ method: "getTravelPlan", createNew: createNew }, function (response) {
                    var travelPlan = response.travelPlan;
                    var appConfig = response.appConfig;
                    var travelPlanList = response.travelPlanList;
                    var index1, index2;

                    $scope.travelPlan = travelPlan;
                    $scope.appConfig = appConfig;
                    $scope.travelPlanList = travelPlanList;
                    $scope.stationName = stationName;
                    $scope.$apply();
                });
            };
            $scope.resetAll = function () {
                chrome.extension.sendRequest({ method: "resetAll" }, function () {
                    $scope.getTravelPlan(true);
                });
            };
            $scope.startBooking = function () {
                $scope.saveTravelPlan(false);
                chrome.tabs.create({ url: "https://www.irctc.co.in/" });
            };
            $scope.getTravelPlan(false);
        }]);
})(angular, chrome);
//# sourceMappingURL=options.js.map
