/*
 *   Copyright (c) 2023 
 *   All rights reserved.
 */

const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
	return res.send('respond with a resource')
})

// add a new route for api's request here...

router.get('/test', (req, res) => {
	return res.send('test')
})

// api routes for users send json

router.get('/users', (req, res) => {
	return res.json({
		users: [
			{
				id: 1,
				name: 'John Doe',
				email: '',
				phone: ''
			},
			{
				id: 2,
				name: 'Jane Doe',
				email: '',
				phone: ''
			}
		]
	})
})

module.exports = router