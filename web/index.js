const authToken = localStorage.getItem('auth-token')

// Sending messages, a simple POST
function PublishForm(form) {
	function sendMessage(message) {
		fetch('http://localhost:3000/message/send/room/2', {
			method: 'POST',
			body: JSON.stringify({ message }),
			headers: { 'Content-Type': 'application/json', 'auth-token': authToken }
		}).then(async res => console.log('-->', await res.json()))
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

function showMessage(elem, message) {
	let messageElem = document.createElement('div')
	messageElem.append(message)
	elem.append(messageElem)
}

// Receiving messages with long polling
function SubscribePane(elem, url) {
	url = 'http://localhost:3000/message/room/subscribe/2'

	async function subscribe() {
		let response = await fetch(url, { headers: { 'auth-token': authToken } })

		if (response.status == 502) {
			// Connection timeout
			// happens when the connection was pending for too long
			// let's reconnect
			await subscribe()
		} else if (response.status != 200) {
			// Show Error
			showMessage(elem, response.statusText)
			// Reconnect in one second
			await new Promise(resolve => setTimeout(resolve, 1000))
			await subscribe()
		} else {
			// Got message
			console.log('Get the message');
			let message = await response.json()
			showMessage(elem, message.data.message.body)
			await subscribe()
		}
	}

	subscribe()
}

function GetAllMessages(elem) {
	async function getAll() {
		let response = await fetch('http://localhost:3000/message/room/2?from=2022-07-06T04:22:54.000Z', {
			headers: { 'auth-token': authToken }
		})
		response = await response.json()
		if (response.code === 200) {
			let messages = response.data.messages
			messages.map(msg => showMessage(elem, JSON.stringify({ message: msg.body, from: msg.user_id })))
		}
	}
	getAll()
}
