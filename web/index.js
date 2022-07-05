const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop)
})

// Sending messages, a simple POST
function PublishForm(form) {
	function sendMessage(message) {
		fetch('http://localhost:3000/message/send/room/1/' + params.userId, {
			method: 'POST',
			body: JSON.stringify({ message }),
			headers: { 'Content-Type': 'application/json' }
		})
	}

	form.onsubmit = function () {
		let message = form.message.value
		if (message) {
			form.message.value = ''
			sendMessage(message)
		}
		return false
	}
}

// Receiving messages with long polling
function SubscribePane(elem, url) {
	url = 'http://localhost:3000/message/room/subscribe/1/' + params.userId
	function showMessage(message) {
		let messageElem = document.createElement('div')
		messageElem.append(message)
		elem.append(messageElem)
	}

	async function subscribe() {
		let response = await fetch(url)

		if (response.status == 502) {
			// Connection timeout
			// happens when the connection was pending for too long
			// let's reconnect
			await subscribe()
		} else if (response.status != 200) {
			// Show Error
			showMessage(response.statusText)
			// Reconnect in one second
			await new Promise(resolve => setTimeout(resolve, 1000))
			await subscribe()
		} else {
			// Got message
			let message = await response.text()
			showMessage(message)
			await subscribe()
		}
	}

	subscribe()
}
