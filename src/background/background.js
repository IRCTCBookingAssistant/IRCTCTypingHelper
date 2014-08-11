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
           preference: [{trainNum:"", class:""}],
           passenger: [{psgName:"",psgAge:"",psgGender:"", psgBerth:"LB", psgSenior:false}],
           autoUpgrade:true,
           onlyConfirm:false,
           bookingBerthCondition:"3",
           coachOpt:false,
           coachId:"",
           mobile:"",
           payment:"NETBANKING",
           bank:"1"
           //,
           //ticketType:{value:"E_TICKET",label:"E-ticket"}
        };
        
        var appConfig = [
            {key:"id", displayName:"Profile Id",control:"span",url:"fake"},
            {key:"name", displayName:"Profile Name",placeholder:"Profile Name",control:"input",type:"text",url:"fake",required:true},
            {key:"userid", displayName:"User Name",placeholder:"User Name",control:"input",type:"text",required:true,
                id:"usernameId",name:"j_username",url:"/eticketing/loginHome.jsf"},
            {key:"pwd",displayName:"Password",placeholder:"Password",control:"input",type:"password",required:true,
                name:"j_password",url:"/eticketing/loginHome.jsf"},
            {key:"from",displayName:"From Station",placeholder:"From Station",control:"typeahead",type:"text",required:true,
                name:"jpform:fromStation",url:"/eticketing/home"},
            {key:"to",displayName:"To Station",placeholder:"To Station",control:"typeahead",type:"text",required:true,
                name:"jpform:toStation",url:"/eticketing/home"},
            {key:"date",displayName:"Journey Date",placeholder:"Journey Date",control:"input",type:"date",required:true,
                name:"jpform:journeyDateInputDate",url:"/eticketing/home"},
            {key:"quota", displayName:"Quota",control:"radio",type:"radio", 
                options:[{value:"GN",label:"GENERAL"},{value:"LD",label:"LADIES"},{value:"CK",label:"TATKAL"}],
                name:"quota",url:"/eticketing/mainpage.jsf"},
            {key:"preference", displayName: "Booking Preference", control:"trainBookingPreference", url:"fake",  
                addBtnCaption: "Add New Preference", deleteBtnCaption: "Delete",
                trainNum:{key:"trainNum", displayName:"Train Number",placeholder:"Train Number",control:"input",type:"number"},
                class:{key:"class", displayName:"Class",control:"radio",type:"radio",
                    options:[{value:"1A",label:"1A"},{value:"2A",label:"2A"},{value:"3A",label:"3A"},
                    {value:"SL",label:"SL"},{value:"CC",label:"CC"},{value:"2S",label:"2S"}]
                }
            },
            {key:"passenger", displayName: "Passenger Details", control:"passengerDetail", max: 6, url:"fake", 
                addBtnCaption: "Add New Passenger", deleteBtnCaption: "Delete",
                psgName: {key:"psgName", displayName:"Name", placeholder:"Passenger Name", control:"input",type:"text",
                    url:"/eticketing/trainbetweenstns.jsf", prefixName:"addPassengerForm:psdetail:", postfixName:":psgnName"},
                psgAge: {key:"psgAge", displayName:"Age", placeholder:"Age", control:"input",type:"number",
                    url:"/eticketing/trainbetweenstns.jsf", prefixName:"addPassengerForm:psdetail:", postfixName:":psgnAge"},
                psgGender: {key:"psgGender", displayName:"Gender", control:"select", 
                    options:[{value:"M", label:"Male"},{value:"F", label:"Female"}],
                    url:"/eticketing/trainbetweenstns.jsf", prefixName:"addPassengerForm:psdetail:", postfixName:":psgnGender"},
                psgBerth: {key:"psgBerth", displayName:"Berth Preference", control:"select",
                    options: [{value:"99",label:"No Preference"},
                        {value:"LB",label:"Lower"},
                        {value:"MB",label:"Middle"},
                        {value:"UB",label:"Upper"},
                        {value:"SL",label:"Side Lower"},
                        {value:"SU",label:"Side Upper"},
                        {value:"WS",label:"Window Side"},
                        {value:"6",label:"Aisle"},
                        {value:"7",label:"Cabin"},
                        {value:"8",label:"Coupe"},
                        {value:"10",label:"Side Middle"}
                        ],
                        url:"/eticketing/trainbetweenstns.jsf", prefixName:"addPassengerForm:psdetail:", postfixName:":berthChoice"},
                psgSenior: {key:"psgSenior", displayName:"Senior Citizen", control:"input", type:"checkbox",
                        url:"/eticketing/trainbetweenstns.jsf", prefixName:"addPassengerForm:psdetail:", postfixName:":concessionOpt"}
            },
            {key:"autoUpgrade", displayName:"Consider for Auto Upgradation", control:"input", type:"checkbox",
                url:"/eticketing/trainbetweenstns.jsf", name:"addPassengerForm:autoUpgrade", required:false},
            {key:"onlyConfirm", displayName:"Book only if confirm berths are allotted", control:"input", type:"checkbox",
                url:"/eticketing/trainbetweenstns.jsf", name:"addPassengerForm:onlyConfirmBerths", required:false},
            {key:"bookingBerthCondition", displayName:"Booking Condition", control:"radio", type:"radio",
                options:[{value:"3",label:"None"},
                {value:"6",label:"Book , only if all berths are allotted in same coach"},
                {value:"4",label:"Book, only if at least 1 lower berth is allotted"},
                {value:"5",label:"Book, only if 2 lower berths are allotted"}],
                url:"/eticketing/trainbetweenstns.jsf", name:"addPassengerForm:bookingCond"},
            {key:"coachOpt",displayName:"Select Option Prefered Coach ID", control:"input",type:"checkbox",required:false,
                url:"/eticketing/trainbetweenstns.jsf", name:"addPassengerForm:prefCoachOpt"},
            {key:"coachId",displayName:"Prefered Coach ID", control:"input",type:"text",required:false,
                url:"/eticketing/trainbetweenstns.jsf", name:"addPassengerForm:coachID"},
            {key:"mobile", displayName:"Mobile Number", control:"input", type:"number",
                url:"/eticketing/trainbetweenstns.jsf", name:"addPassengerForm:mobileNo", required:true},
            {key:"payment",displayName:"Payment Mode", control:"radio", type:"radio",
                options:[{value:"NETBANKING",label:"Net Banking"},
                {value:"CREDIT_CARD",label:"Payment Gateway / Credit Card"},
                {value:"DEBIT_CARD",label:"Debit Card"},
                {value:"CASH_CARD", label:"Cash Card"}],
                url:"/eticketing/jpInput.jsf", name:"jpBook:payOption"},
            {key:"bank", displayName:"Select Bank", control:"select",required:true,
                options: [{value:"1",label:"State Bank of India"},
                    {value:"10",label:"State Bank of India and Associates"},
                    {value:"22",label:"Federal Bank"},
                    {value:"29",label:"Indian Bank"},
                    {value:"28",label:"Union Bank of India"},
                    {value:"31",label:"Andhra Bank"},
                    {value:"34",label:"Punjab National Bank "},
                    {value:"35",label:"Allahabad Bank"},
                    {value:"38",label:"Vijaya Bank"},
                    {value:"39",label:"AXIS Bank"},
                    {value:"36",label:"HDFC Bank"},
                    {value:"37",label:"Bank of Baroda"},
                    {value:"42",label:"Karnataka Bank"},
                    {value:"43",label:"Oriental Bank of Commerce"},
                    {value:"40",label:"Karur Vysya Bank"},
                    {value:"46",label:"Kotak Mahindra Bank"},
                    {value:"47",label:"INGVysya Bank"},
                    {value:"44",label:"ICICI Bank "},
                    {value:"45",label:"IndusInd Bank"},
                    {value:"50",label:"Central Bank of India"},
                    {value:"48",label:"Bank of India"},
                    {value:"54",label:"Syndicate Bank"},
                    {value:"53",label:"Bank of Maharashatra"},
                    {value:"52",label:"IDBI Bank"},
                    {value:"56",label:"Corporation Bank"},
                    {value:"4",label:"Visa/Master Card(Powered By ICICI BANK)"},
                    {value:"21",label:"Visa/Master Card(Powered By HDFC BANK)"},
                    {value:"27",label:"American Express"},
                    {value:"30",label:"Visa/Master Card(Powered By AXIS BANK)"}],
                url:"/eticketing/jpInput.jsf",name:"jpBook:bankPGList"}
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