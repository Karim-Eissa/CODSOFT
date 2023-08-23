const express=require('express');
const morgan=require('morgan');
const mongoose=require('mongoose');
const cors=require('cors');
const cookieParser=require('cookie-parser');
require('dotenv').config()
const appRoutes=require('./routes/approutes');
const authRoutes=require('./routes/authroutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

//initialize express app
const app=express();
app.listen(3000)

// connecting to mongodb
const dbURI=process.env.database;
mongoose
	.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000})
.then(()=>{console.log('Connected to database')})
.catch((err)=>console.log(err))
//register view engine
app.set('view engine','ejs');
app.set('views','pages');

//middleware
app.use(cors());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.get('*', checkUser);
app.post('*', checkUser);
app.use('/',appRoutes);
app.use('/',authRoutes);
app.get('/',(req,res)=>{
	res.redirect('/home')
})
app.use((req,res)=>{
	res.status(404).render('404',{title:"404"})
})
