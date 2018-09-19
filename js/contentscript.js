"use strict";
var mousePos = {x:0, y:0, pageX:0, pageY:0}

chrome.storage.sync.get(['mySwitch'], function(result) {});

document.addEventListener('mousedown', function (event) {
	mousePos.x = event.clientX;
	mousePos.y = event.clientY;
});

document.addEventListener('mouseup', function (event) {
	chrome.storage.sync.get(['mySwitch'], function(result) {
		if(result.mySwitch) {
			if((Math.abs(event.clientX - mousePos.x) > 5) || Math.abs(event.clientY - mousePos.y) > 3) {
				getResult(event);
			}
		}
	});
});

// var img_tick = chrome.runtime.getURL("../images/tick.png");
// var img_cross = chrome.runtime.getURL("../images/cross.png");
// console.log("img_tick: " + img_tick)
// console.log("img_cross: " + img_cross)
// var img_tick = url('chrome-extension://__MSG_@@hiahnldpgklfidfgngfajhbfooeciooa__/images/main.png');
// var img_cross = url('chrome-extension://__MSG_@@hiahnldpgklfidfgngfajhbfooeciooa__/images/main.png');

function getResult(event) {
	var text = document.getSelection().toString();
	if(text) {

		mousePos.pageX = event.pageX;
		mousePos.pageY = event.pageY;

		var wrap = document.createElement('div');
		wrap.className = 'ppWin';
		wrap.style.top = (mousePos.pageY + 20) + 'px';
		if (mousePos.pageX + 350 + 15 > document.documentElement.clientWidth) {
			wrap.style.left = document.documentElement.clientWidth - 15 -350 + 'px';
		} else if (mousePos.pageX < 175 + 15) {
			wrap.style.left = '15px';
		} else {
			wrap.style.left = mousePos.pageX - 175 + 'px';
		}
		wrap.innerHTML = '<div class="RDHead">' + 
		'<b>Review Identifier</b>' +'</div>' + '</div>' +
		'<div class="RDpage">' +
		'<center><div class="RDloader"></center></div>'+
		'</div>'
		;

		document.body.appendChild(wrap);
		var data = {
	  		"selectedText": text
	    }
	    chrome.runtime.sendMessage(data, function(response) {
	    	popWin(response, wrap);
	    })
    }
}

function popWin(response, wrap) {
	var num = response.tru_score;
	if(num < 0.5) {
		num = 1 - num
	}
	var confi = new Number(num * 100)
	// var imgURL
	// if(response.tru === 'Deceptive') {
	// 	imgURL = img_cross
	// } else {
	// 	imgURL = img_tick
	// }
	wrap.innerHTML = '<div class="RDHead">' + 
		'<b>Review Identifier</b>' +'</div>' + '</div>' +
		// '<div class="RDimage"><img src=' + imgURL + '/></div>' +
		'<div class="RDpage">' +
		'Sentiment: ' + response.pol + '<br>' +
		'Polarity: ' + response.tru +'<br>' + 
		'Confidence: ' + confi.toFixed(1) +'%'+'</div>'
		;

	document.addEventListener('mousedown', function (event) {
		event.stopPropagation();
		if (wrap && document.getElementsByClassName('ppWin')[0]) {
			document.body.removeChild(wrap);
		}
	});
}