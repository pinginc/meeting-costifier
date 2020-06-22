const googleCalendarTabEventDetailsId = 'tabEventDetails';
const addingCalendarEventMessage = 'AddingCalendarEvent';

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  // listen for messages sent from background.js
	  if (request.message === addingCalendarEventMessage) {
		  if (request.url.toString().indexOf('https://calendar.google.com/calendar/r/eventedit/' > 0)) {
			waitForElement(googleCalendarTabEventDetailsId, function(){
				addButtonDivWithIcon();
			});
		  }
	  }
  });

function waitForElement(id, callback){
    const poops = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(poops);
            callback();
        }
    }, 100);
}

waitForElement(googleCalendarTabEventDetailsId, function(){
    addButtonDivWithIcon();
});

function addButtonDivWithIcon() {
	const button = createCostButton();
	const icon = createCostIcon();
	const div = createCostDiv(icon, button);
	if (!document.getElementById('meetingCostDiv')) {
		const googleCalendarTabEventElement = document.getElementById(googleCalendarTabEventDetailsId);
		googleCalendarTabEventElement.prepend(div);
	}
}

function createCostDiv(icon, button) {
	const div = document.createElement('div');
	div.id = 'meetingCostDiv';
	div.appendChild(icon);
	div.appendChild(button);
	return div;
}

function createCostIcon() {
	const icon = document.createElement('img');
	icon.src = chrome.extension.getURL('src/inject/icon.png');
	icon.style.margin = '0px 0px 0px 26px';
	return icon;
}

function createCostButton() {
	const button = document.createElement('button');
	button.style.width = '164px';
	button.style.margin = '4px 0px 4px 22px';
	button.style.height = '36px';
	button.innerHTML = 'Add Meeting Costs';
	button.id = 'meetingCost';
	button.addEventListener('click', buttonClickEvent);
	return button;
}

function buttonClickEvent() {
	const descriptionInputElement = document.querySelector('[aria-label="Description"]');
	const startDate = parseDomStartDate();
	const endDate = parseDomEndDate();
	const numberOfParticipants = parseNumberOfParticipants();
	const durationInHours = calculateDurationInHours(endDate, startDate);
	const costPerHour = 100;
	removePlaceholderDescriptionText();
	prependDescriptionTextWithMeetingCosts(descriptionInputElement, numberOfParticipants, costPerHour, durationInHours);
}

function prependDescriptionTextWithMeetingCosts(descriptionInputElement, numberOfParticipants, costPerHour, durationInHours) {
	var unroundedMeetingCost = numberOfParticipants * costPerHour * durationInHours;
	var roundedMeetingCost = Math.ceil(unroundedMeetingCost/100)*100
	descriptionInputElement.innerHTML = `[Meeting cost: $${roundedMeetingCost}] - ${descriptionInputElement.innerHTML}`;
}

function removePlaceholderDescriptionText() {
	const defaultTexts = document.querySelectorAll('[jsname="V67aGc"]');
	for (const defaultText of defaultTexts) {
		if (defaultText && defaultText.innerHTML === 'Add description') {
			defaultText.innerHTML = '';
		}
	};
}

function calculateDurationInHours(endDate, startDate) {
	return (endDate - startDate) / (1000 * 3600);
}

function parseNumberOfParticipants() {
	const participants = document.getElementById('xDetDlgAtt');
	const participantsElements = document.querySelector('[aria-label="Guests invited to this event."]');;
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
	return numberOfParticipants;
}

function parseDomEndDate() {
	const endTimeElement = document.querySelector('[aria-label="End time"]');
	const endDateElement = document.querySelector('[aria-label="End date"]');
	const endTimeText = `${endDateElement.value} ${endTimeElement.value.slice(0, -2)} ${endTimeElement.value.slice(-2, endTimeElement.value.length)}`;
	const endDate = Date.parse(endTimeText);
	return endDate;
}

function parseDomStartDate() {
	const startTimeElement = document.querySelector('[aria-label="Start time"]');
	const startDateElement = document.querySelector('[aria-label="Start date"]');
	const startTimeText = `${startDateElement.value} ${startTimeElement.value.slice(0, -2)} ${startTimeElement.value.slice(-2, startTimeElement.value.length)}`;
	const startDate = Date.parse(startTimeText);
	return startDate;
}
