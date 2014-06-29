var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	first_name: { type: String, required: true},
  	last_name: { type: String, required: true},
  	email: { type: String, required: true},
  	loc: { type: { type: String }, coordinates: [ ] }
});

UserSchema.index({ loc: '2dsphere' });

UserSchema.statics.newUser = function (username, location, fn) {
    var instance = new User();
    instance.username = username;
    instance.loc = location;

    console.log('IT HAS BEEN SAVED!');

	instance.save(function (err) {
		/*
		if (err) {
			return fn(new Error('Error'));
		} else {

		}
		if (typeof(fn) == "function") {
		    fn(err, instance);
		};
		*/
	 }); //save
}; //newuser

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
