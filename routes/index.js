var user_model = require('../models/users.js');
var User = user_model.User;

exports.home = function(req, res){
	User.list(function(users) {
		res.render('index', {
			'user_list': users
			//message: req.flash('info')
		});
		//console.log(users)
	});
};