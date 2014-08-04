;(function(chrome,$,undefined){
    'use strict';
    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.create({url: "options/options.html"});
    });

    chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
        var storageArea = chrome.storage.sync;

        var saveData = function(key, value, callback) {
            var temp = {};
            temp[key] = value;
            storageArea.set(temp, callback);
        };

        var getData = function(key, callback) {
            storageArea.get(key, function(data){
                callback(data[key]);
            });
        };

        var removeData = function(key, callback){
            storageArea.remove(key,callback);
        };
        
        var resetAll = function(callback) {
            storageArea.clear(callback);
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

        var defaultPlanId = function() {
            return "ID"+Math.floor((Math.random()*100000)+1);
        };
        
        var defaultTravelPlan = {
           id: defaultPlanId(),
           name: "",
           userid: "",
           pwd: "",
           from:"",
           to:"",
           date:defaultDate(),
           quota:"CK",
           preference: [{trainNum:"", class:""}]
           //,
           //ticketType:{value:"E_TICKET",label:"E-ticket"}
        };
        
        var appConfig = [
            {key:"id", displayName:"Profile Id",control:"span",url:"fake"},
            {key:"name", displayName:"Profile Name",placeholder:"Profile Name",control:"input",type:"text",url:"fake"},
            {key:"userid", displayName:"User Name",placeholder:"User Name",control:"input",type:"text",
                id:"usernameId",name:"j_username",url:"/eticketing/loginHome.jsf"},
            {key:"pwd",displayName:"Password",placeholder:"Password",control:"input",type:"password",
                name:"j_password",url:"/eticketing/loginHome.jsf"},
            {key:"from",displayName:"From Station",placeholder:"From Station",control:"typeahead",type:"text",
                name:"jpform:fromStation",url:"/eticketing/home"},
            {key:"to",displayName:"To Station",placeholder:"To Station",control:"typeahead",type:"text",
                name:"jpform:toStation",url:"/eticketing/home"},
            {key:"date",displayName:"Journey Date",placeholder:"Journey Date",control:"input",type:"date",
                name:"jpform:journeyDateInputDate",url:"/eticketing/home"},
            {key:"quota", displayName:"Quota",control:"radio",type:"radio", 
                options:[{value:"GN",label:"GENERAL"},{value:"LD",label:"LADIES"},{value:"CK",label:"TATKAL"}],
                name:"quota",url:"/eticketing/mainpage.jsf"},
            {key:"preference", displayName: "Booking Preference", control:"trainBookingPreference", url:"fake", 
                addBtnCaption: "Add New Preference", deleteBtnCaption: "Delete",
                trainNum:{key:"trainNum", displayName:"Train Number",placeholder:"Train Number",control:"input",type:"number",
                url:"fake"},
                class:{key:"class", displayName:"Class",control:"radio",type:"radio",
                    options:[{value:"1A",label:"1A"},{value:"2A",label:"2A"},{value:"3A",label:"3A"},
                    {value:"SL",label:"SL"},{value:"CC",label:"CC"},{value:"2S",label:"2S"}]
                }
            }
            //,
            //{key:"ticketType", displayName:"Ticket Type", control:"select",
            //    id:"jpform:ticketType",name:"jpform:ticketType",options:[{value:"E_TICKET",label:"E-ticket"}],url:"/eticketing/home12"}
        ];

       
        var defaultTravelPlanList = {list:[],currentTravelPlan:""};

        switch(request.method)
        {
            case "saveTravelPlan" :
            {
                var travelPlan = request.data;
                var currentTravelPlan = request.currentTravelPlan;
                getData("travelplanlist",function(data){
                    var index1;
                    var travelPlanList = $.extend(true, {}, defaultTravelPlanList, data);
                    var travelPlanFound = false;
                    var currentTravelPlanFound = false;
                    
                    //check if travel plan already exist
                    for(index1 = 0; index1 < travelPlanList.list.length; index1+=1)
                    {
                        if(travelPlanList.list[index1].id === travelPlan.id) {
                            //Sync the updated name
                            travelPlanList.list[index1].name = travelPlan.name;
                            travelPlanFound = true;
                            break;
                        }
                    }

                    if(!travelPlanFound) {
                        travelPlanList.list.push({id:travelPlan.id,name:travelPlan.name});
                    }

                    //check if proposed currentTravelPlan exist.
                    for(index1 = 0; index1 < travelPlanList.list.length; index1+=1)
                    {
                        if(travelPlanList.list[index1].id === currentTravelPlan) {
                            travelPlanList.currentTravelPlan = travelPlanList.list[index1].id;
                            currentTravelPlanFound = true;
                            break;
                        }
                    }

                    if(!currentTravelPlanFound) {
                        travelPlanList.currentTravelPlan = travelPlan.id;
                    }

                    saveData("travelplanlist",travelPlanList, function() {
                        saveData("travelplan"+travelPlan.id,travelPlan, function() {
                            sendResponse({}); 
                        });
                    });
                });
                break;
            }
            case "deleteTravelPlan" :
            {
                var deleteTravelPlan = request.data;
                getData("travelplanlist",function(data){
                    var index1;
                    var travelPlanList = $.extend(true, {}, defaultTravelPlanList, data);
                    
                    //check if travel plan already exist
                    for(index1 = 0; index1 < travelPlanList.list.length; index1+=1)
                    {
                        if(travelPlanList.list[index1].id === deleteTravelPlan.id) {
                            travelPlanList.list.splice(index1,1);
                            break;
                        }
                    }

                    travelPlanList.currentTravelPlan = travelPlanList.list[0].id;

                    saveData("travelplanlist",travelPlanList, function() {
                        removeData("travelplan"+deleteTravelPlan.id, function() {
                            sendResponse({}); 
                        });
                    });
                });
                break;
            }
            case "getTravelPlan" :
            {
                var createNew = request.createNew;
                getData("travelplanlist",function(data) {
                    var travelPlanList = $.extend(true, {}, defaultTravelPlanList, data);
                    var dataKey;
                    if(createNew) {
                        dataKey = "fake";
                    }
                    else {
                        dataKey = "travelplan"+travelPlanList.currentTravelPlan;
                    }
                    getData(dataKey,function(data){
                        var travelPlan = $.extend(true, {}, defaultTravelPlan, data);
                        travelPlanList.currentTravelPlan = travelPlan.id; 
                        sendResponse({'travelPlan':travelPlan, 'appConfig': appConfig, 'travelPlanList':travelPlanList});
                    });
                });
                break;
            }
            case "resetAll" : 
            {
                resetAll(function(data){
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
})(chrome,jQuery);