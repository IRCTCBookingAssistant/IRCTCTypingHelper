;(function(chrome){
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
                    sendResponse(data);
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
})(chrome);