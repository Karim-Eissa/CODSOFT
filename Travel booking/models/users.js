const mongoose = require('mongoose');
const { isEmail } = require('validator');
const Ticket = require('./Ticket'); // Require the Ticket model

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  bookedFlights: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }], // Reference to the Ticket model
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
