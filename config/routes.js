const common = require('../app/controllers/image');

module.exports = function( app ){

    //save previous page
    app.get('*', (req, res, next)=>{
    	next();
    })
  	// Common
  	app.use('/', image);
  	// User
}
