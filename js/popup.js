"use strict";
var bkg = chrome.extension.getBackgroundPage();

chrome.browserAction.setPopup({popup: "popup.html"}, function() {
  chrome.storage.sync.get(['mySwitch'], function(result) {
    if(result.mySwitch) {
      document.getElementById("handle").setAttribute("checked", "")
    } else {
      if(document.getElementById("handle").hasAttribute("checked")) {
        document.getElementById("handle").removeAttribute("checked")
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementsByClassName("slider round")[0].addEventListener("click", function() {
    chrome.storage.sync.get(['mySwitch'], function(result) {
      chrome.storage.sync.set({mySwitch: !result.mySwitch});
    });
  });
});
