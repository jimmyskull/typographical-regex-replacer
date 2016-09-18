//Default replacements
var default_replacements = [
  // Quotes
  [' "', ' “'],
  ['" ', '” '],
  ['^"', '“'],
  ['"', '”'],
  [" '", ' ‘'],
  ["'", '’'],
  // Punctuation
  ['\\.\\.\\.+', '…'],
  ['\\.\\. +', '… '],
  [' +…', '…'],
  ['!!!+', '!!!'],
  ['^\\* ?', '•\u2002'],
  ['^- ?', '\u2015\u2002'],
  ['^> ?', '►\u2002'],
  [' - ', '\u2009—\u2009'], // Hyphen to emdash
  [' -- ', '\u2009—\u2009'], // Hyphens to em-dash
  ['([a-z])-- ', '$1\u2009—\u2009'], // Hyphens to em-dash
  ['([0-9])-([0-9])', '$1–$2'], // Hyphen to en-dash
  // Spacing
  [' , ', ', '], // Remove space before comma
  ['([\\.…])([a-zA-Z])', '$1 $2'], // Space after sentence
  [' *: ', '\u200A:\u2002'], // Space before and after colon
  ['[\u2009\u200A ]*([\\?!]+)', '\u2009$1'], // Space before ? and !
  ['([a-z])\\.([a-z])', '$1.\u2009$2'],  // e.g. & i.e.
  // Better symbols
  ['-->', '⇒'],
  [' x ', '\u205F×\u205F'],
  ['([0-9])x([0-9])', '$1\u205F×\u205F$2'],
];

//Default Blacklist
var default_blacklisted_sites = [
];

var debug = false;

function checkBlackList(url, blacklist) {
  url = url.toLowerCase() || "";
  blacklist = blacklist || [];
  for (var i = blacklist.length - 1; i >= 0; i--) {
    if (url.indexOf(blacklist[i]) > -1) {
      return false;
    }
  }
  return true;
}

function injectionScript(tabId, info, tab) {
  if (debug) {console.log("injection fire");}
  chrome.storage.sync.get(null, function (result) {
    if (result
        && result["status"] === "enabled"
        && checkBlackList(tab.url, result['blacklist'])) {
      chrome.tabs.executeScript(tabId, {
        file: "js/substitutions.js",
        runAt: "document_end"
      }, function (){
        if (debug){console.log('Script Executed');}
      });
    }
  });
}

function addMessage(request, sender, sendResponse) {
  if (debug) { console.log("message fire"); }
  chrome.storage.sync.get(null, function(result) {
    if (request === "config" && result["replacements"]) {
      sendResponse(result["replacements"]);
    }
  });
  return true;
}

function fixDataCorruption() {
  if (debug) { console.log("updateStore"); }
  chrome.storage.sync.get(null, function(result) {
    if (!result["status"]) {
      chrome.storage.sync.set({
        "status": "enabled"
      });
    }
    if (!result["replacements"]) {
      chrome.storage.sync.set({
        "replacements": default_replacements
      });
    }
    if (!result["blacklist"]) {
      chrome.storage.sync.set({
        "blacklist": default_blacklisted_sites
      });
    }
  });
}

function toggleActive() {
  if (debug) { console.log("clickfire"); }
  chrome.storage.sync.get("status", function(result) {
    if (result["status"] === null) {
      status = "enabled";
    } else {
      status = result["status"];
    }
    if (status === "enabled") {
      icon = {
        "path": "images/disabled.png"
      };
      message = {
        "title": "click to enable regex replacer"
      };
      status = "disabled";
    } else if (status === "disabled") {
      icon = {
        "path": "images/enabled.png"
      };
      message = {
        "title": "click to disable regex replacer"
      };
      status = "enabled";
    }
    chrome.browserAction.setIcon(icon);
    chrome.browserAction.setTitle(message);
    chrome.storage.sync.set({
      "status": status
    });
  });
}

chrome.browserAction.onClicked.addListener(toggleActive);
chrome.runtime.onMessage.addListener(addMessage);
chrome.tabs.onUpdated.addListener(injectionScript);
chrome.runtime.onInstalled.addListener(fixDataCorruption);
chrome.runtime.onStartup.addListener(fixDataCorruption);
