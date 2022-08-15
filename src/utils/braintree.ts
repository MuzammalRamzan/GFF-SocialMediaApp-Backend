import { Console } from 'console'

const Express = require('express')
const app = Express()

const braintree = require('braintree')

const client = require('braintree-web/client')
const dataCollector = require('braintree-web/data-collector')

const gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
	merchantId: '9kpq3sdks86t2jbb',
	publicKey: '3bh79vgjt4js8fkk',
	privateKey: '9374fe6d8bafd49d60d4c7f1d57635ab'
})

// gateway.customer.create(
// 	{
// 		firstName: 'Bob',
// 		lastName: 'Jhon',
// 		company: 'Braintree',
// 		email: 'bob@yopmail.com',
// 		phone: '9714029100',
// 		fax: '614.555.5678',
// 		website: 'www.example.com'
// 	},
// 	(err: any, result: { success: any; customer: { id: any } }) => {
// 		result.success
// 		result.customer.id

// 		console.log(result)
// 	}
// )

// Output =>
// {
//   customer: Customer {
//     id: '151585740',
//     merchantId: '9kpq3sdks86t2jbb',
//     firstName: 'Bob',
//     lastName: 'Jhon',
//     company: 'Braintree',
//     email: 'bob@yopmail.com',
//     phone: '9714029100',
//     fax: '614.555.5678',
//     website: 'www.example.com',
//     createdAt: '2022-08-01T05:39:56Z',
//     updatedAt: '2022-08-01T05:39:56Z',
//     customFields: '',
//     globalId: 'Y3VzdG9tZXJfMTUxNTg1NzQw',
//     graphQLId: 'Y3VzdG9tZXJfMTUxNTg1NzQw',
//     creditCards: [],
//     addresses: [],
//     paymentMethods: []
//   },
//   success: true
// }

// gateway.customer.find('151585740', function (err: any, customer: any) {
// 	console.log(customer)
// })

// gateway.clientToken.generate({
//   customerId: 151585740
// }, (err, response) => {
//   // pass clientToken to your front-end
//   const clientToken = response.clientToken
//   console.log(clientToken)
// });

// Output =>
// eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjMkZ1WkdKdmVDSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbk5oYm1SaWIzZ3VZbkpoYVc1MGNtVmxaMkYwWlhkaGVTNWpiMjBpZlEuZXlKbGVIQWlPakUyTlRrME1UZzROakFzSW1wMGFTSTZJbUkwTW1GbFpqTTRMV0ZoTnpZdE5EY3dZUzA1WVRWaUxUa3hOR1JqTW1Nd05qWTRPQ0lzSW5OMVlpSTZJamxyY0hFemMyUnJjemcyZERKcVltSWlMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRndhUzV6WVc1a1ltOTRMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SWl3aWJXVnlZMmhoYm5RaU9uc2ljSFZpYkdsalgybGtJam9pT1d0d2NUTnpaR3R6T0RaME1tcGlZaUlzSW5abGNtbG1lVjlqWVhKa1gySjVYMlJsWm1GMWJIUWlPbVpoYkhObGZTd2ljbWxuYUhSeklqcGJJbTFoYm1GblpWOTJZWFZzZENKZExDSnpZMjl3WlNJNld5SkNjbUZwYm5SeVpXVTZWbUYxYkhRaVhTd2liM0IwYVc5dWN5STZleUpqZFhOMGIyMWxjbDlwWkNJNklqRTFNVFU0TlRjME1DSjlmUS4zdl9aeGtGNE5tOVUxX25WWGZqMHZva2ZaNTdDdTdKQVk2bG1udlhGTmJXaExZUDZiQ0txdFFXNUt3Q0Q4VmNNeFpnSkhfaHMtREJ1RXQ0QXFiLUM4QT9jdXN0b21lcl9pZD0iLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvOWtwcTNzZGtzODZ0MmpiYi9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJncmFwaFFMIjp7InVybCI6Imh0dHBzOi8vcGF5bWVudHMuc2FuZGJveC5icmFpbnRyZWUtYXBpLmNvbS9ncmFwaHFsIiwiZGF0ZSI6IjIwMTgtMDUtMDgiLCJmZWF0dXJlcyI6WyJ0b2tlbml6ZV9jcmVkaXRfY2FyZHMiXX0sImhhc0N1c3RvbWVyIjp0cnVlLCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvOWtwcTNzZGtzODZ0MmpiYi9jbGllbnRfYXBpIiwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwibWVyY2hhbnRJZCI6IjlrcHEzc2Rrczg2dDJqYmIiLCJhc3NldHNVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImF1dGhVcmwiOiJodHRwczovL2F1dGgudmVubW8uc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbSIsInZlbm1vIjoib2ZmIiwiY2hhbGxlbmdlcyI6W10sInRocmVlRFNlY3VyZUVuYWJsZWQiOnRydWUsImFuYWx5dGljcyI6eyJ1cmwiOiJodHRwczovL29yaWdpbi1hbmFseXRpY3Mtc2FuZC5zYW5kYm94LmJyYWludHJlZS1hcGkuY29tLzlrcHEzc2Rrczg2dDJqYmIifSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImJpbGxpbmdBZ3JlZW1lbnRzRW5hYmxlZCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJhbGxvd0h0dHAiOnRydWUsImRpc3BsYXlOYW1lIjoiTW9iaWFuIiwiY2xpZW50SWQiOm51bGwsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImVudmlyb25tZW50Ijoib2ZmbGluZSIsImJyYWludHJlZUNsaWVudElkIjoibWFzdGVyY2xpZW50MyIsIm1lcmNoYW50QWNjb3VudElkIjoibW9iaWFuIiwiY3VycmVuY3lJc29Db2RlIjoiVVNEIn19

// device data example
// {"correlation_id":"252f0d922a4e24653eae66e139cc4115"}

// gateway.transaction.sale(
// 	{
// 		amount: '10.00',
// 		paymentMethodNonce: nonceFromTheClient,
// 		options: {
// 			submitForSettlement: true
// 		}
// 	},
// 	(err: any, result: any) => {}
// )
