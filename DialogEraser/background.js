chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, {type: "ToggleAllDialogs"});
});

function UnDisplayThis(tabID) {
    chrome.tabs.sendMessage(tabID, {type: "UnDisplayThis"});
}

function AssignDisableThisSite(tabID) {
    chrome.tabs.sendMessage(tabID, {type: "AssignDisableThisSite"});
}

const langCode = navigator.language;
const DefaultLanguageCode = "en";
const ContextMenuID_UnDisplayThis = "ContextMenuTitle_UnDisplayThis";
const ContextMenuID_AssignDisableThisSite = "ContextMenuTitle_AssignDisableThisSite";
const MESSAGES = {
    "en": {
        "ContextMenuTitle_UnDisplayThis": {
            "message": "Hide this"
        },
        "ContextMenuTitle_AssignDisableThisSite": {
            "message": "Always hide dialogs on this site"
        }
    },
    "ja": {
        "ContextMenuTitle_UnDisplayThis": {
            "message": "非表示にする"
        },
        "ContextMenuTitle_AssignDisableThisSite": {
            "message": "常にこのサイトでダイアログを非表示にする"
        }
    },
    "zh_CN": {
        "ContextMenuTitle_UnDisplayThis": {
            "message": "隐藏这个"
        },
        "ContextMenuTitle_AssignDisableThisSite": {
            "message": "始终隐藏此站点上的对话框"
        }
    },
    "zh_TW": {
        "ContextMenuTitle_UnDisplayThis": {
            "message": "隱藏這個"
        },
        "ContextMenuTitle_AssignDisableThisSite": {
            "message": "始終隱藏此站點上的對話框"
        }
    }
};
function GetLocalizedString(target){
    if(chrome.i18n.getMessage){
        const message = chrome.i18n.getMessage(target);
        return message;
    }
    const message = MESSAGES[navigator.language]?.[target]?.message;
    if(message){ return message; }
    return MESSAGES[DefaultLanguageCode]?.[target]?.message;
}

chrome.contextMenus.create({
    id: ContextMenuID_UnDisplayThis,
    title: GetLocalizedString(ContextMenuID_UnDisplayThis),
    contexts: ["page"],
    type: "normal",
}, () => chrome.runtime.lastError);

chrome.contextMenus.create({
    id: ContextMenuID_AssignDisableThisSite,
    title: GetLocalizedString(ContextMenuID_AssignDisableThisSite),
    contexts: ["action"],
    type: "normal",
}, () => chrome.runtime.lastError);

chrome.contextMenus.onClicked.addListener((info,tab) => {
    switch(info.menuItemId){
        case ContextMenuID_UnDisplayThis:
            UnDisplayThis(tab.id);
            break;
        case ContextMenuID_AssignDisableThisSite:
            AssignDisableThisSite(tab.id);
            break;
        default:
            console.log("unknown menuItemId", info.menuItemId, info);
            break;
    }
});
