/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/chrome/chrome.d.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />
(function (angular, chrome, $) {
    "use strict";
    chrome.extension.sendRequest({ method: "getTravelPlan", createNew: false },
        function (response) {
            var travelPlan = response.travelPlan;
            var appConfig = response.appConfig;
            var index1;

            var ctrlMap = [
                { url: "/eticketing/loginHome.jsf", id: "loginFormId" },
                { url: "/eticketing/home", id: "jpform" },
                { url: "/eticketing/mainpage.jsf", id: "avlAndFareForm" },
                { url: "/eticketing/trainbetweenstns.jsf", id: "addPassengerForm" },
                { url: "/eticketing/jpInput.jsf", id: "jpBook" }
            ];

            /*
            var getDateInSearchFormat = function() {
                var d = new Date(travelPlan.date.val);
                var day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                return day[d.getDay()] + " " + month[d.getMonth()] + " " + String(d.getDate() + 100).slice(1) + 
                            " 00:00:00 IST " + d.getFullYear();
            };

            var findTrainAndClass = function() {
                var allTrains = $("#avlAndFareForm").find("a");
                var index1;
                var target;
                var searchExpression = "availFareEnq[(]this,'"+travelPlan.trainNum.val+"','" + 
                        getDateInSearchFormat() + "','"+travelPlan.class.val +"','";
                for(index1 = 0; index1 < allTrains.length; index1 += 1 ) {
                    if($(allTrains[index1]).attr("onclick").search(searchExpression) !== -1) {
                        target = allTrains[index1];
                        break;
                    }
                }
                if(angular.isUndefined(target)) {
                    alert("Train Not Found. Please verify the travel plan.");
                }
                return target;
            };

            var findSeat = function() {
                var searchExpression = travelPlan.trainNum.val + "-" + travelPlan.class + "-" + travelPlan.quota;
                var isUiLoaded = false;
                var index1;
                var target;
                if($("#avlAndFareForm").find("#tabul").find("li.ctab").text().serach(searchExpression) !== -1) {
                    isUiLoaded = true;
                }
                if(isUiLoaded) {
                    var allLinks = $("#avlAndFareForm").find("a");
                    var d = new Date(travelPlan.date.val);
                    searchExpression = "jpBook[(]this,'" + travelPlan.trainNum.val + "','[A-Z',]+','" + d.getDate() + "-" + 
                        (d.getMonth() + 1) + "-" + d.getFullYear() + "','2S','GN',1[)];";
                    for(index1 = 0; index1 < allLinks.length; index1 += 1) {
                        if($(allLinks[index1]).attr("onclick").search(searchExpression) !== -1) {
                            target = allLinks[index1];
                            break;
                        }
                    }
                }
                return target;
            };

            var clickCallback = function(target){
                target.click();
            };

            var pageDriver = [
                {url:"/eticketing/home", name:"jpform:jpsubmit", eventCallback:clickCallback},
                {url:"/eticketing/mainpage.jsf", searchCallback:findTrainAndClass, eventCallback:clickCallback},
                {url:"/eticketing/mainpage.jsf", searchCallback:findSeat, eventCallback:clickCallback}
            ];
            */

            var findTarget = function (targetKey, callback) {
                var target;
                if (location.pathname === targetKey.url) {
                    if (angular.isDefined(targetKey.id)) {
                        target = $("#" + targetKey.id);
                    } else if (angular.isDefined(targetKey.name)) {
                        var controlType = "input";
                        if (targetKey.control === "select") {
                            controlType = "select";
                        }
                        target = $(controlType + "[name='" + targetKey.name + "']");
                    } else if (angular.isFunction(targetKey.searchCallback)) {
                        target = targetKey.searchCallback();
                    }
                    callback(target);
                }
                return target;
            };

            var assignAttrib = function (targetKey, attrName, attrVal) {
                findTarget(targetKey, function (target) {
                    target.attr(attrName, attrVal);
                });
            };

            var processAppConfig = function (config) {
                var index1 = 0;
                for (index1 = 0; index1 < config.length; index1 += 1) {
                    if (config[index1].control === "input" && config[index1].type === "date") {
                        travelPlan[config[index1].key] = toTravelDate(travelPlan[config[index1].key]);
                    }
                    assignAttrib(config[index1], "ng-model", "travelPlan['" + config[index1].key + "']");
                }
            };

            var processTravelPlan = function (plan, config, planVarName, subplanIndex) {
                angular.forEach(plan, function (planValue, planKey) {
                    angular.forEach(config, function (configValue, configKey) {
                        if (planKey === configValue.key) {
                            if (angular.isArray(planValue)) {
                                angular.forEach(planValue, function (subplanValue, subplanKey) {
                                    processTravelPlan(subplanValue, configValue,
                                        planVarName + "['" + configValue.key + "'][" + subplanKey + "]", subplanKey);
                                });
                            } else {
                                if (angular.isDefined(configValue.prefixName)) {
                                    configValue.name = configValue.prefixName + subplanIndex + configValue.postfixName;
                                }
                                assignAttrib(configValue, "ng-model", planVarName + "['" + configValue.key + "']");
                            }
                        }
                    });
                });
            };

            var toTravelDate = function (dateStr) {
                var dateVal = new Date(dateStr);
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return (String(dateVal.getDate() + 100).slice(1) + "-" + months[dateVal.getMonth()] + "-" + dateVal.getFullYear());
            };

            for (index1 = 0; index1 < ctrlMap.length; index1 += 1) {
                assignAttrib(ctrlMap[index1], "ng-controller", "pageCtrl");
            }

            // Fix travel plan date
            travelPlan.date = toTravelDate(travelPlan.date);
            processTravelPlan(travelPlan, appConfig, "travelPlan", 0);

            angular.module("booking", [])
                .controller("pageCtrl", function ($scope) {
                    $scope.travelPlan = travelPlan;
                });
            angular.bootstrap(document, ["booking"]);

            // move to next form
            //
            //for(index1=0; index1 < pageDriver.length; index1 += 1) {
            //	findTarget(pageDriver[index1], pageDriver[index1].eventCallback);
            //}
        });
})(angular, chrome, jQuery);
