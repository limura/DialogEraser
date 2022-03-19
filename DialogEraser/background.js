chrome.action.onClicked.addListener((tab) => {
    console.log("clicked", tab);
    chrome.tabs.sendMessage(tab.id, {type: "ToggleAllDialogs"});
});

function UnDisplayThis(tabID) {
    console.log("UnDisplayThis called");
    chrome.tabs.sendMessage(tabID, {type: "UnDisplayThis"})
}

const ContextMenuID_UnDisplayThis = "ContextMenuTitle_UnDisplayThis";
const rightClickMenuTitleMap_UnDisplayThis = {
    en: "Hide this",
    ja: "非表示にする",
    zh_CN: "隐藏这个",
    zh_TW: "隱藏這個",
}
const langCode = navigator.language;
var ContextMenuTitle_UnDisplayThis = rightClickMenuTitleMap_UnDisplayThis[langCode];
if(ContextMenuTitle_UnDisplayThis.length <= 0){
    ContextMenuTitle_UnDisplayThis = rightClickMenuTitleMap_UnDisplayThis["en"];
}

chrome.contextMenus.onClicked.addListener((info,tab) => {
    switch(info.menuItemId){
        case ContextMenuID_UnDisplayThis:
            UnDisplayThis(tab.id);
            break;
        default:
            console.log("unknown menuItemId", info.menuItemId, info);
            break;
    }
});
chrome.contextMenus.create({
    id: ContextMenuID_UnDisplayThis,
    title: ContextMenuTitle_UnDisplayThis,
    contexts: ["page"],
    type: "normal",
}, () => chrome.runtime.lastError);
