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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.type){
    case "ToggleAllDialogs":
        ToggleAllDialogs();
        break;
    case "UnDisplayThis":
        UnDisplayThis();
        break;
    default:
        console.log("unknown message", message);
        break;
    }
});
