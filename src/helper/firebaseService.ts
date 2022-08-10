import { App, cert, initializeApp } from 'firebase-admin/app'
import { getMessaging, Message, Messaging } from 'firebase-admin/messaging'
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api'

export class FirebaseApp {
  private readonly app: App
  private readonly messaging: Messaging

  constructor () {
    this.app = initializeApp({
      // credential: cert(process.cwd()+ '/firebase.json'),
    }, 'firebase')

    // Initialize Firebase Cloud Messaging and get a reference to the service
    this.messaging = getMessaging(this.app)
  }

  send (message: Message, tokens: string[] = []) {
    return this.messaging.send(message)
      .then((response: any) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response)
      })
      .catch((error: any) => {
        console.log('Error sending message:', error)
      })
  }

  sendMultiple (message: MulticastMessage, tokens: string[] = []) {
    return this.messaging.sendMulticast(message)
      .then((response: any) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response)
      })
      .catch((error: any) => {
        console.log('Error sending message:', error)
      })
  }

  // subscribe() {
  // 	this.messaging.subscribeToTopic("/topics/test" ).then(value => {
  // 		console.log('value', value)
  // 	})
  // }

}

export class FirebaseService {
  private static instance: FirebaseApp

  constructor () {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseApp()
    }
  }

  getInstance () {
    return FirebaseService.instance
  }

}

