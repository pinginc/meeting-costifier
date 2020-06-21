chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  // listen for messages sent from background.js
	  if (request.message === 'AddingCalendarEvent') {
		  if (request.url.toString().indexOf('https://calendar.google.com/calendar/r/eventedit/' > 0)) {
			waitForElement("tabEventDetails", function(){
				addButton();
			});
		  }
	  }
  });

function waitForElement(id, callback){
    var poops = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(poops);
            callback();
        }
    }, 100);
}

waitForElement("tabEventDetails", function(){
    addButton();
});
function addButton() {
	var item = document.getElementById("tabEventDetails")
		var button = document.createElement("button");
		var img = document.createElement('img'); 
		img.src = chrome.extension.getURL('src/inject/icon.png');
		img.style.margin = '0px 0px 0px 26px';
		button.style.width = '164px';
		button.style.margin = '4px 0px 4px 22px';
		button.style.height = '36px';
		button.innerHTML = "Add Meeting Costs";
		button.id = 'meetingCost';
		button.addEventListener('click',function(){
			// console.log('btnComment worked')
			var titleInput = document.getElementById('xTiIn');
			var descriptionInput = document.querySelector('[aria-label="Description"]');
			
			
			var startTimeElement = document.querySelector('[aria-label="Start time"]');
			var startDateElement = document.querySelector('[aria-label="Start date"]');
			const startTimeText = `${startDateElement.value} ${startTimeElement.value.slice(0, -2)} ${startTimeElement.value.slice(-2, startTimeElement.value.length)}`;
			// console.log(startTimeText);
			const startDate = Date.parse(startTimeText);
			// console.log(startDate);
			
			
			var endTimeElement = document.querySelector('[aria-label="End time"]');
			var endDateElement = document.querySelector('[aria-label="End date"]');
			const endTimeText = `${endDateElement.value} ${endTimeElement.value.slice(0, -2)} ${endTimeElement.value.slice(-2, endTimeElement.value.length)}`;
			// console.log(endTimeText);
			const endDate = Date.parse(endTimeText);
			// console.log(endDate);
			
			
			var participants = document.getElementById('xDetDlgAtt');
			var participantsElements = document.querySelector('[aria-label="Guests invited to this event."]');
			// console.log(participants);
			// console.log(participantsElements.childElementCount);
			let numberOfParticipants;
			if (participants) {
				numberOfParticipants = participants.innerHTML.match(/([\d.]+) *guests/)[1];
			}
			else if (participantsElements) {
				numberOfParticipants = participantsElements.childElementCount;
			}
			if (numberOfParticipants <= 0) {
				numberOfParticipants = 1;
			}
			var durationInHours = (endDate - startDate) / (1000 * 3600);
			var costPerHour = 100;
			// console.log(`The duration in hours is: ${durationInHours}`);
			// console.log(`There are ${numberOfParticipants} participants at the meeting`);

			// var defaultTexts = document.querySelectorAll('[jsname="LwH6nd"]');
			// for (var defaultText of defaultTexts) {
			// 	if (defaultText && defaultText.innerHTML === 'Add description') {
			// 		defaultText.innerHTML = '';
			// 	}
			// }
			var defaultTexts = document.querySelectorAll('[jsname="V67aGc"]');
			for (var defaultText of defaultTexts) {
				if (defaultText && defaultText.innerHTML === 'Add description') {
					defaultText.innerHTML = '';
				}
			}
			// titleInput.value = `[Meeting cost: $${numberOfParticipants * costPerHour * durationInHours}] - ${titleInput.value}`;
			// titleInput.focus();
			descriptionInput.innerHTML = `[Meeting cost: $${numberOfParticipants * costPerHour * durationInHours}] - ${descriptionInput.innerHTML}`;
		});
		div = document.createElement('div');
		div.id = 'meetingCostDiv';
		div.appendChild(img)
		div.appendChild(button)
		if (!document.getElementById('meetingCostDiv')) {
			item.prepend(div);
		}
}

// chrome.extension.sendMessage({}, function(response) {
// 	var readyStateCheckInterval = setInterval(function() {
// 	if (document.readyState === "complete") {
// 		clearInterval(readyStateCheckInterval);
// 		// ----------------------------------------------------------
// 		// This part of the script triggers when page is done loading
// 		// ----------------------------------------------------------

// 	}
// 	}, 10);
// });