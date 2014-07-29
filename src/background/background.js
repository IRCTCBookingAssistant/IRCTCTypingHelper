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
        
        var appConfig = [
            {key:"userid", displayName:"User Id",placeholder:"User Id",control:"input",type:"text",
                id:"usernameId",name:"j_username",url:"/eticketing/loginHome.jsf"},
            {key:"pwd",displayName:"Password",placeholder:"Password",control:"input",type:"password",
                name:"j_password",url:"/eticketing/loginHome.jsf"},
            {key:"from",displayName:"From Station",placeholder:"From Station",control:"typeahead",type:"text",
                name:"jpform:fromStation",url:"/eticketing/home"},
            {key:"to",displayName:"To Station",placeholder:"To Station",control:"typeahead",type:"text",
                name:"jpform:toStation",url:"/eticketing/home"},
            {key:"date",displayName:"Journey Date",placeholder:"Journey Date",control:"input",type:"date",
                name:"jpform:journeyDateInputDate",url:"/eticketing/home"}
            //,
            //{key:"ticketType", displayName:"Ticket Type", control:"select",
            //    id:"jpform:ticketType",name:"jpform:ticketType",options:[{value:"E_TICKET",label:"E-ticket"}],url:"/eticketing/home12"}
        ];

        var ctrlMap = [
            {url:"/eticketing/loginHome.jsf",id:"loginFormId"},
            {url:"/eticketing/home",id:"jpform"}
        ];
        
        var pageDriver = [
            {url:"/eticketing/home",name:"jpform:jpsubmit"}
        ];

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
                    sendResponse({'travelPlan':travelPlan, 'appConfig': appConfig, 'ctrlMap':ctrlMap, 'pageDriver':pageDriver});
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