"use strict";
chrome.storage.sync.set({mySwitch: true}, function() {});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		preprocessing(request, sender, sendResponse)
		return true;
});

function preprocessing(request, sender, sendResponse) {
	var resp = sendResponse;
	$.ajax({
	    url: 'http://zhuoli.pythonanywhere.com/',
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(request), 
	}).done(function(result){     
		const model = new KerasJS.Model({
   	 		filepath: '../bin/model_lstm_withWeights.bin',
    		gpu: true
    	})
    	var rmodel = model.ready()
    	.then(() => {
      		const inputData = {
        		input: new Float32Array(result.processedText[0])
      		}
      	return model.predict(inputData)
    	}).then(outputData => {
      		var resArray = outputData['output']
      		var polarity
      		var truthfulness
      		if (resArray[0] > 0.5) {
        	polarity = 'Negative';
      		} else {
        		polarity = 'Positive';
      		}
      		if (resArray[1] > 0.5) {
        		truthfulness = 'Deceptive'
      		} else {
        		truthfulness = 'Genuine'
      		}
    		var res = {
				pol: polarity,
				tru: truthfulness,
				pol_score: resArray[0],
				tru_score: resArray[1]
			}
			sendResponse(res)
    	}).catch(err => {
      		console.log("An error occurred during prediction")
      		console.log(err)
    	});		
	});	
}
