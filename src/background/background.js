;(function(chrome){
    'use strict';
    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.create({url: "options/options.html"});
    });

    chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
        var saveLocal = true;
        
        var savedata = function(key, value){
            value = JSON.stringify(value);
            if(saveLocal)
            {
                localStorage[key] = value;
            }
        };

        var getdata = function(key){
            var data;
            if(saveLocal) {
                data = localStorage[key];
            }
            return JSON.parse(data);
        };
        
        switch(request.method)
        {
            case "saveTravelPlan" :
            {
                savedata("travelplan",request.data);
                break;
            }
            case "getTravelPlan" :
            {
                var data = getdata("travelplan");
                sendResponse(data);
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