const HostSettingMapKey = 'HostSettingMap';

function GetUniqueID(){
    return location.href.replace(location.pathname, '');
}

function AssignDisable(uniqueID, completion){
    chrome.storage.sync.get([HostSettingMapKey], (hostSettingMap)=>{
        var hostSetting = hostSettingMap[HostSettingMapKey];
        if(hostSetting){
            var currentData = hostSetting[uniqueID];
            if(currentData){
                currentData['isDisabled'] = true;
            }else{
                return;
            }
            hostSetting[uniqueID] = currentData;
        }else{
            hostSetting = {}
            hostSetting[uniqueID] = { zapCount: 0, isDisabled: true };
        }
        const saveData = {};
        saveData[HostSettingMapKey] = hostSetting;
        chrome.storage.sync.set(saveData, ()=>{completion();});
    });
}

// isDisabled が true なWebサイトであれば自動で発火するようにします
function ZapIfDisabledSite(uniqueID){
    chrome.storage.sync.get([HostSettingMapKey], (hostSettingMap) => {
        const hostSetting = hostSettingMap[HostSettingMapKey];
        if(hostSetting?.[uniqueID]?.isDisabled){
            ToggleAllDialogs();
        }
    });
}

var zapedElementArray= [];
function ZapElement(element){
    if(!element.style){ return; }
    if(element.style.display == "none"){ return; }
    zapedElementArray.push({
        element: element,
        display: element.style.display
    });
    element.style.display = "none";
    //console.log("ZAP! ZAP! ZAP!", element, zapedElementArray);
}
function ResumeZapedElements(){
    for(const i in zapedElementArray){
        const element = zapedElementArray[i].element;
        const display = zapedElementArray[i].display;
        if(!element){continue;}
        //console.log("resume:", element);
        element.style.display = display;
    }
    zapedElementArray = [];
}

function FindAndKillDialog(targetElement, depthRemaining, depthMax){
    if(depthRemaining >= depthMax){ return; }
    const position = window.getComputedStyle(targetElement).position;
    if(position == 'fixed'){
        ZapElement(targetElement);
        return;
    }
    Array.from(targetElement.children).forEach((element) => {
        FindAndKillDialog(element, depthRemaining + 1, depthMax);
    });
}
function ToggleAllDialogs(){
    if(zapedElementArray.length <= 0){
        FindAndKillDialog(document.body, 0, 10);
    }else{
        ResumeZapedElements();
    }
}

function SearchTopFloatingElement(element){
    const parent = element.parentElement;
    if(parent === undefined){ return element; }
    if(parent === document.body){ return undefined; }
    const position = window.getComputedStyle(parent).position;
    if(position == 'fixed'){
        return parent;
    }
    return SearchTopFloatingElement(parent);
}

function UnDisplayThis(){
    const selection = window.getSelection();
    if(selection.rangeCount <= 0){ return; }
    const startElement = selection.getRangeAt(0).startContainer;
    const floatingTopElement = SearchTopFloatingElement(startElement);
    if(floatingTopElement === undefined) { return; }
    console.log("targetElement", startElement, floatingTopElement);
    ZapElement(floatingTopElement);
}

function AssignDisableThisSite(){
    AssignDisable(GetUniqueID(), ()=>{
        if(zapedElementArray.length <= 0){
            ToggleAllDialogs();
        }
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.type){
    case "ToggleAllDialogs":
        ToggleAllDialogs();
        break;
    case "UnDisplayThis":
        UnDisplayThis();
        break;
    case "AssignDisableThisSite":
        AssignDisableThisSite();
        break;
    default:
        console.log("unknown message", message);
        break;
    }
    return true;
});

chrome.storage.sync.get([HostSettingMapKey], (hostSettingMap) => {
    const uniqueID = GetUniqueID();
    const hostSetting = hostSettingMap[HostSettingMapKey];
    if(hostSetting?.[uniqueID]?.isDisabled){
        const timeoutMillisecond = hostSetting?.[uniqueID]?.timeoutMillisecond ?? 1500;
        setTimeout(()=>{
            ZapIfDisabledSite(uniqueID);
        }, 1500);
    }
});


