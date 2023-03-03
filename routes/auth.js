/*
 *   Copyright (c) 2023 
 *   All rights reserved.
 */
const express = require('express')

const router = express.Router()


router.get('/login', (req, res) => {
	return res.json({
		message: "Login required."
	})
})

router.post('/login', (req, res) => {
	console.log(req.body)
	let { username, password } = req.body
	if (username === 'admin' && password === 'admin') {
		req.session.authorized = true
		return res.send("Logged in.")
	}
	res.redirect('/api/auth/login')
})

router.get('/logout', (req, res) => {
	req.session.authorized = false
	res.redirect('/api/auth/login')
})

const authHandler = function (req, res, next) {
	let isAuthorized = req.session.authorized
	if (isAuthorized) {
		next()
	} else {
		console.log('not authorized')
		res.redirect('/api/auth/login')
	}
}




module.exports = {
	router: router,
	authHandler: authHandler
}

