const express=require('express');
const router=express.Router();
const {requireAuth}=require('../middleware/authMiddleware')
const appController=require('../controllers/appcontroller')
require('dotenv').config()

router.get('/home', appController.home_get);
router.get('/search',requireAuth,appController.search_get);
router.post('/search', appController.search_post);
router.get('/tickets',appController.tickets_get);
router.get('/flightsResults', appController.flightsResults_get);
router.get('/flightsResults/:flightid', appController.flightsDetails_get);  
router.get('/flightsResults/:flightid/book', appController.book_get);
router.post('/flightsResults/:flightid/book', appController.book_post);
router.post('/tickets/:ticketId/delete', appController.app_post);

module.exports = router;
