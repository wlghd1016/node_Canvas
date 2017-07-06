a'use strict';
const express        = require('express');
const path           = require('path');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const mongoStore     = require('connect-mongo')(session);
const methodOverride = require('method-override');
const flash 		 = require('connect-flash');
const sass 		     = require('node-sass-middleware');
const fs			 = require('fs');
const app            = express();

module.exports = function( app, passport ) {
	// dev logger
	fs.existsSync('../log') || fs.mkdirSync('../log')

	var accesslog = FileStreamRotator.getStream({
		date_format: 'YYYYMMDD',
		filename: path.join('../log','log-%DATE%.log'),
		frequency: 'daily',
		verbose: false
	});

	app.use(logger('combined', {
		stream:accesslog,
		immediate:false,
		skip: function(req,res){
			return res.statusCode === 304;
		}
	}));
	// sass middleware
	// app.use(sass({
	// 	src: path.join(__dirname, '../app/assets/'),
	// 	dest: path.join(__dirname, '../app/assets/'),
	// 	outputStyle: 'compressed',
	// 	indentedSyntax: true
	// }));

	// asset
	app.use(express.static(path.join(__dirname, '../app/assets')));
	app.use(express.static(path.join(__dirname, '../data')));

	// view engine setup
	app.set('views', path.join(__dirname, '../app/views'));
	app.set('view engine', 'jade');

	app.use(favicon(path.join(__dirname, '../app/assets/favicon/', 'favicon.ico')));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(methodOverride());
	app.use(cookieParser());
	app.use(session({
		secret: 'a4blabbya4banana',
		resave: false,
		saveUninitialized: false
	}));
	app.use(flash());

	// passport
	app.use(passport.initialize());
	app.use(passport.session());

};
