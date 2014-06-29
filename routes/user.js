var user_model = require('../models/users.js');

var User = user_model.User;

exports.register_post = function(req, res){
	User.newUser(req.body.first_name, req.body.last_name, req.body.email, function (err) {
		if (err) {
			req.flash('info', err.toString());
		} else {
			req.flash('info', 'User successfully created!');
		}
		res.redirect("/");
	});
};

exports.delete_post = function(req, res){

  	User.deleteUser(req.params.email, function() {
  		req.flash('info', 'User deleted!');
  		res.redirect('/');
  	})
};
