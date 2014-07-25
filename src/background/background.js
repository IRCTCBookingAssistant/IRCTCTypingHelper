;(function(chrome,$,undefined){
    'use strict';
    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.create({url: "options/options.html"});
    });

    chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
        var storageArea = chrome.storage.sync;
        
        var saveData = function(key, value) {
            var temp = {};
            temp[key] = value;
            storageArea.set(temp);
        };

        var getData = function(key, callback) {
            storageArea.get(key, function(data){
                callback(data[key]);
            });
        };
        
        var defaultDate = function() {
            var now = new Date();
            var nextday = new Date(now.getFullYear(), now.getMonth(), 
                now.getDate() + 1,0,now.getTimezoneOffset() * (-1),0,0);
            var formattedDate = String(10000 * nextday.getFullYear() + 
                100 * (nextday.getMonth() + 1) + 
                nextday.getDate());
            return formattedDate.slice(0,4) + '-' + formattedDate.slice(4,6) + '-' + formattedDate.slice(6);
        };
        
        var defaultTravelPlan = {
           userid: {val:""},
           pwd: {val:""},
           from:{val:""},
           to:{val:""},
           date:{val: defaultDate()},
           ticketType:{val:{value:"E_TICKET",label:"E-ticket"}}
        };
        
        switch(request.method)
        {
            case "saveTravelPlan" :
            {
                saveData("travelplan",request.data);
                break;
            }
            case "getTravelPlan" :
            {
                getData("travelplan",function(data){
                    var travelPlan = $.extend(true, {}, defaultTravelPlan, data);
                    sendResponse(travelPlan);
                });
                break;
            }
            default:
            {
                sendResponse({}); // snub them.
                break;
            }
       }
    });
})(chrome,jQuery);