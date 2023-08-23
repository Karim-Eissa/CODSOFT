const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const flightTicket=new Schema({
	user:{
		type: String,
		required: true
	},
	fullName:{
		type: String,
		required: true
	},
	dateBirth:{
		type: String,
		required: true
	},
	gender:{
		type:String,
		required:true
	},
	passportId:{
		type: String,
		required: true
	},
	dateIssue:{
		type: String,
		required: true
	},
	from:{
		type: String,
		required: true
	},
	to:{
		type: String,
		required: true
	},
	adults:{
		type: String,
		required: true
	},
	class:{
		type: String,
		required: true
	},
	date:{
		type: String,
		required: true
	},
	flightName:{
		type: String,
		required: true
	},
	flightCode:{
		type: String,
		required: true
	},
	time:{
		type: String,
		required: true
	},
	timezone:{
		type: String,
		required: true
	},
	seat:{
		type: String,
		required: true
	},
	gate:{
		type: String,
		required: true
	},
},{timestamps:true});
const Ticket=mongoose.model('ticket',flightTicket);
module.exports=Ticket;
