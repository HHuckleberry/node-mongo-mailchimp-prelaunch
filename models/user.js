var mongoose    = require("mongoose"),
    passportLM  = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    email: "String",
    firstname: "String",
    lastname: "String",
});

userSchema.plugin(passportLM);

module.exports = mongoose.model('User', userSchema);
