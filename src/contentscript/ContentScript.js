(function (angular, chrome, $) {
    'use strict';
    chrome.extension.sendRequest({ method: "getTravelPlan", createNew: false }, function (response) {
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
                if (config[index1].control === 'input' && config[index1].type === 'date') {
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
                                processTravelPlan(subplanValue, configValue, planVarName + "['" + configValue.key + "'][" + subplanKey + "]", subplanKey);
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
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return (String(dateVal.getDate() + 100).slice(1) + "-" + months[dateVal.getMonth()] + "-" + dateVal.getFullYear());
        };

        for (index1 = 0; index1 < ctrlMap.length; index1 += 1) {
            assignAttrib(ctrlMap[index1], "ng-controller", "pageCtrl");
        }

        travelPlan.date = toTravelDate(travelPlan.date);
        processTravelPlan(travelPlan, appConfig, "travelPlan", 0);

        angular.module('booking', []).controller('pageCtrl', function ($scope) {
            $scope.travelPlan = travelPlan;
        });
        angular.bootstrap(document, ['booking']);
    });
})(angular, chrome, jQuery);
//# sourceMappingURL=ContentScript.js.map
