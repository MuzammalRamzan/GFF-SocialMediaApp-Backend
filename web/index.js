const authToken = localStorage.getItem('auth-token')
const params = new URLSearchParams(window.location.search)

// Sending messages, a simple POST
function PublishForm(form) {
	function sendMessage(message) {
		fetch('http://localhost:3000/message/send/room/' + params.get('room_id'), {
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
	url = 'http://localhost:3000/message/room/subscribe/' + params.get('room_id')

	async function subscribe() {
		let response = await fetch(url, { headers: { 'auth-token': authToken } })

		if (response.status == 201) {
			console.log('->timeout')
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
			console.log('Get the message')
			let message = await response.json()
			if (message?.data?.messages?.length) {
				message.data.messages.map(msg => showMessage(elem, msg.body))
			}
			await subscribe()
		}
	}

	subscribe()
}

// Receiving new incoming message notification with long polling
function SubscribeToGetUnreadMessageNotification() {
	const timestamp = (Date.now() / 1000) | 0
	const url = 'http://localhost:3000/message/subscribe?timestamp=' + timestamp

	async function subscribe() {
		let response = await fetch(url, { headers: { 'auth-token': authToken } })

		if (response.status == 201) {
			console.log('->timeout')
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
			console.log('Get the message')
			let message = await response.json()
			if (message?.data?.messages?.length) {
				message.data.messages.map(msg => console.log('-->NEW', msg))
			}
			await subscribe()
		}
	}

	subscribe()
}

function GetAllMessages(elem) {
	async function getAll() {
		let response = await fetch(
			'http://localhost:3000/message/room/' +
				params.get('room_id') +
				'?from=2022-07-06T04:22:54.000Z&to=2022-08-08T04:22:54.000Z',
			{
				headers: { 'auth-token': authToken }
			}
		)
		response = await response.json()
		if (response.code === 200) {
			let messages = response.data.messages
			messages.map(msg => showMessage(elem, JSON.stringify({ message: msg.body, from: msg.user_id })))
		}
	}
	getAll()
}
