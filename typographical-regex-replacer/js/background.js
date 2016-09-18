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
  ['!!!*', '‼'],
  ['!\\?', '⁉'],
  ['\\?!', '⁈'],
  ['\\?\\?\\?*', '⁇'],
  ['^\\* ?', '•\u2002'],
  ['^- ?', '\u2015\u2002'],
  ['^> ?', '►\u2002'],
  [' - ', '\u2009—\u2009'], // Hyphen to emdash
  [' -- ', '\u2009—\u2009'], // Hyphens to em-dash
  ['---', '—'],
  ['([a-zA-Z])—([a-zA-Z])', '$1\u2009—\u2009$2'], // Hyphens to em-dash
  ['([a-z])-- ', '$1\u2009—\u2009'], // Hyphens to em-dash
  ['([0-9])-([0-9])', '$1–$2'], // Hyphen to en-dash
  // Spacing
  [' , ', ', '], // Remove space before comma
  ['([a-z][\\.…])([A-Z][a-z])', '$1 $2'], // Space after sentence
  [' *: ', '\u200A:\u2002'], // Space before and after colon
  ['[\u2009\u200A ]*([\\?!⁇‼⁈⁉]+)', '\u200A$1'], // Space before ? and !
  [' ([a-zA-Z]+)[   ]*/[   ]*([a-zA-Z]+)', ' $1\u200A/\u200A$2'],
  ['([a-z])\\.([a-z])\\.', '$1.\u200A$2.'],  // e.g. & i.e.
  ['([A-Z])\\.([A-Z])\\.', '$1.\u200A$2.'],  // F.A.Q. & acronyms
  // Better symbols
  ['^No.$', '№'],
  ['===?', '≡'],
  ['!=', '≠'],
  ['=?/=', '≠'],
  ['>>>+', '⋙'],
  ['>>', '≫'],
  ['<<<+', '⋘'],
  ['<<', '≪'],
  ['<=', '≤'],
  ['>=', '≥'],
  ['<<', '≪'],
  [' ~ ', ' \u223c '],
  ['-->', '⇒'],
  ['->', '⇒'],
  ['<->', '⇐'],
  ['<--', '⇐'],
  ['<-', '⇐'],
  ['<-->', '⇔'],
  ['<==>', '⇔'],
  ['<=>', '⇔'],
  ['\\([Cc]\\)', '©'],
  ['\\([Rr]\\)', '®'],
  ['([0-9]+)o ', '$1º '],
  ['([0-9]+)o\\. ', '$1º. '],
  ['([0-9]+ ?)[o°º]C', '$1℃'],
  ['([0-9]+ ?)[o°º]F', '$1℉'],
  [' x ', '\u205F×\u205F'],
  ['([0-9])x([0-9])', '$1\u205F×\u205F$2'],
  // Specific for english.  These are very likely to mess up things
  ['^i ', 'I '],
  [' i ', ' I '],
  ['i’ll', 'I’ll'],
  ['i’m', 'I’m'],
  ['^[Uu] ', 'You '],
  [' u ', ' you '],
  [' ur ', ' you\'re '],
  ['^ur ', 'You\'re '],
  [' plz', ' please'],
  [' pls', ' please'],
  [' r ', ' are '],
  [' b ', ' be '],
  [' c ', ' see '],
  ['iirc', 'IIRC'],
  ['btw', 'BTW'],
  ['afaik', 'AFAIK'],
  [' asap', ' ASAP'],
  ['its the', 'it’s the'],
  ['couldnt', 'couldn’t'],
  ['shouldnt', 'shouldn’t'],
  ['([Ww]here)d', '$1’d'],
  ['neednt', 'needn’t'],
  [' tho$', ' though'],
  [' cant', ' can’t'],
  ['hasnt', 'hasn’t'],
  ['didnt', 'didn’t'],
  ['thats', 'that’s'],
  ['theyve', 'they’ve'],
  ['Id ', 'I’d '],
  ['([Ss]?he)s ', '$1’s '],
  // Smiley
  [' :-\\)', ' ☺'],
  [' :\\)', ' ☺'],
  [' :\\(', ' ☹'],
  ['<3', '♥'],
  // Roman
  ['\\(i\\)', '(ⅰ)'],
  ['\\(ii\\)', '(ⅱ)'],
  ['\\(iii\\)', '(ⅲ)'],
  ['\\(iv\\)', '(ⅳ)'],
  ['\\(v\\)', '(ⅴ)'],
  ['\\(vi\\)', '(ⅵ)'],
  ['\\(vii\\)', '(ⅶ)'],
  ['\\(viii\\)', '(ⅷ)'],
  ['\\(ix\\)', '(ⅸ)'],
  ['\\(x\\)', '(ⅹ)'],
  ['\\(xi\\)', '(ⅺ)'],
  ['\\(xii\\)', '(ⅻ)'],
  ['^i\\. ', 'ⅰ.\u2002'],
  ['^ii\\. ', 'ⅱ.\u2002'],
  ['^iii\\. ', 'ⅲ.\u2002'],
  ['^iv\\. ', 'ⅳ.\u2002'],
  ['^v\\. ', 'ⅴ.\u2002'],
  ['^vi\\. ', 'ⅵ.\u2002'],
  ['^vii\\. ', 'ⅶ.\u2002'],
  ['^viii\\. ', 'ⅷ.\u2002'],
  ['^ix\\. ', 'ⅸ.\u2002'],
  ['^x\\. ', 'ⅹ.\u2002'],
  ['^xi\\. ', 'ⅺ.\u2002'],
  ['^xii\\. ', 'ⅻ.\u2002'],
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
