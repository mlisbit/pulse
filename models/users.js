var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	username: { type: String, required: true},
  	loc: { type: { type: String }, coordinates: [ ] }
});

UserSchema.index({ loc: '2dsphere' });

UserSchema.statics.newUser = function (username, location, fn) {
    var instance = new User();
    instance.username = username;
    instance.loc = location;

    console.log('IT HAS BEEN SAVED!');

	instance.save(function (err) {
		if (err) {
			console.log('error in saving user.' + err);
		} else {
			console.log('user saved')
		}
	 }); //save
}; //newuser

UserSchema.statics.changeUsername = function (oldname, newname, fn) {
	User.findOne({username : oldname}, function(err, user) {
		user.username = newname;
	    user.save(function (err) {
	        if(err) {
	            console.error('ERROR!');
	        } else {
	        	console.log('user has been updated')
	        	fn();
	        }
	    });
	});
}


UserSchema.statics.list = function (fn) {
    User.find({}, function (err, users) {
    	if (err) {
    		return err;
    	} else {
    		fn(users);
    	}
    });
}; //list

UserSchema.statics.deleteUser = function (email, fn) {
    User.findOne({email : email}, function(err, doc) {
		doc.remove(function(err) {
			fn();
		});
	});
}; //list

User = mongoose.model('User', UserSchema);
exports.User = User;
