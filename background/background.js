;(function(chrome){
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({url: "options.html"});
});

var tabPreference = {};
var tabStartupProfileId = null;

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    //console.log(JSON.stringify(request));
    var resultFunc = false;
    switch(request.method)
    {
        case "saveData":
        {
            localStorage["IRCTCData"] = JSON.stringify(request.data);
            resultFunc = true;
            sendResponse({result: resultFunc});
            break;
        }
        case "loadData":
        {
            var strdata = localStorage["IRCTCData"];
            var data = {options:{},master:{}};
            var tabData = {automationRunning:true};
            if(tabStartupProfileId != null) {
                tabData.profileId = tabStartupProfileId;
            }
            if(strdata != null)
            {
                 data = JSON.parse(strdata);
                 resultFunc = true;

                 if(sender.tab != null 
                     && tabPreference[sender.tab.id] != null)
                 {
                     tabData = tabPreference[sender.tab.id];
                 }
            }
            
            sendResponse({result: resultFunc, data:data, tabData:tabData});
            break;
        }
        case "saveTabData":
        {
            if(sender.tab)
            {
                tabPreference[sender.tab.id] = request.tabData;
                resultFunc = true;
            }
            sendResponse({result: resultFunc, data:tabPreference});
            break;
        }
        case "saveTabStartProfileId":
        {
            tabStartupProfileId = request.tabStartupProfileId;
            resultFunc = true;
            sendResponse({result: resultFunc, tabStartupProfileId: tabStartupProfileId});
            break;
        }
        case "ImagesSettings" :
        {
            var setting = "allow";
             
            if(request.setting == false)
            {
                var setting = "block";
            }
            chrome.contentSettings.images.set({
                    setting: setting,
                    primaryPattern: "https://www.irctc.co.in/*"
                });
            resultFunc = true;
            sendResponse({result: resultFunc});
            break;
        }
        default:
        {
            sendResponse({}); // snub them.
        }
   }
  });

})(chrome);