const express=require('express');
const axios = require('axios');
const Ticket=require('../models/Ticket');
require('dotenv').config()

let storedApiResponse = null; // To store the API response data temporarily

module.exports={
	home_get:(req, res) => {
   		res.render('index', { title: 'Home' });
	},
	search_get:(req, res) => {
		res.render('flightsForm', { title: 'Search',error:'.'});
	},
	tickets_get: async(req, res) => {
		try {
			// Fetch tickets associated with the logged-in user
			const userTickets = await Ticket.find({ user: res.locals.user._id }).sort({ createdAt: -1 });
			// Render the tickets view and pass the tickets data
			console.log(userTickets)
			res.render('tickets', { title: 'My Tickets', tickets: userTickets });
		  } catch (err) {
			console.error(err);
			res.status(500).send('Internal Server Error');
		  }
	},
	search_post: async(req, res) => {
		const newQuery=req.body;
		console.log(newQuery)
		const options = {
			method: 'GET',
			url: 'https://flight-fare-search.p.rapidapi.com/v2/flights/',
			params: {
			from: newQuery.from, 
			to: newQuery.to, 
			date: newQuery.date, 
			adult: newQuery.adults, 
			type: newQuery.class, 
			currency: 'USD'
			},
			headers: {
			'X-RapidAPI-Key': process.env.RAPID_API_KEY2,
			'X-RapidAPI-Host': 'flight-fare-search.p.rapidapi.com'
			}
		};
		try {        
			const apiResponse = await axios.request(options)
			storedApiResponse = apiResponse.data
			console.log(storedApiResponse);
			res.redirect('/flightsResults')

		} catch (err) {
			res.render('flightsForm', { title: 'Search',error:'Something went wrong. Please try again.'});
			console.log(err)
		}
	},
	flightsResults_get: (req, res) => {
    	res.render('flights', { title: 'Results',apiResponse:storedApiResponse});
	},
	flightsDetails_get: (req, res) => {
	const flightid=req.params.flightid;
	const selectedFlight = storedApiResponse.results.find(flight => flight.id === flightid);
    res.render('details', { title: 'Details',singleFlight:selectedFlight,apiResponse:storedApiResponse});
	},
	book_get: (req, res) => {
		const flightid=req.params.flightid;
		const selectedFlight = storedApiResponse.results.find(flight => flight.id === flightid);
		res.render('book', { title: 'Booking',singleFlight:selectedFlight,apiResponse:storedApiResponse});
	},
	book_post: async(req,res)=>{
		const flightid=req.body.id;
		console.log(req.body)
		const randomNumber = Math.floor(Math.random() * 500) + 1;
		const randomLetter = Math.random() < 0.5 ? 'A' : 'B';
		const result = randomNumber + randomLetter;
		const randomGate = Math.floor(Math.random() * 15) + 1;
		const newTicket = new Ticket({
			user:res.locals.user._id,
			fullName:req.body.fullName,
			dateBirth:req.body.dateBirth,
			passportId:req.body.passportId,
			dateIssue:req.body.dateIssue,
			gender:req.body.gender,
			from:req.body.from,
			to:req.body.to,
			adults:req.body.adults,
			class:req.body.class,
			date:req.body.date,
			flightName:req.body.flightName,
			flightCode:req.body.flightCode,
			time:req.body.time,
			timezone:req.body.timezone,
			seat: result,
			gate:randomGate
		});
		await newTicket.save();
		console.log(newTicket)
        console.log('ticket saved');
		let adultCnt=req.body.adults;
		if(adultCnt>1){
			res.redirect(`/flightsResults/${flightid}/book`)
		}else{
			res.redirect('/tickets')
		}
	},
	// Add this route to your existing routes setup
	app_post: async (req, res) => {
		try {
		const ticketId = req.params.ticketId;
	
		// Find the ticket by ID and ensure it belongs to the logged-in user
		const ticketToDelete = await Ticket.findOne({ _id: ticketId, user: res.locals.user._id });
	
		if (!ticketToDelete) {
			// Ticket not found or doesn't belong to the user
			return res.status(404).send('Ticket not found');
		}
	
		// Delete the ticket
		await ticketToDelete.deleteOne();
		
		// Redirect to the tickets page after successful deletion
		res.redirect('/tickets');
		} catch (err) {
		console.error(err);
		res.status(500).send('Internal Server Error');
		}
	}
};
