const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    // "unique: true" => in case of having too much email address in DB,
    // creates internal index for the 'email' field in DB
    // which allows fast searching and finding the data in that field.
    // however with "mongoose-unique-validator" 
    // it is a validation check from now on. 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    // ref => mongoose.model('Place') in place.js file.
    // By adding '[]' we tell Mongoose that "in documents based
    // schema" we have multiple places entries instead of just one value.
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]
});

userSchema.plugin(uniqueValidator);

//  'User' => will create a collection name: 'users'
module.exports = mongoose.model('User', userSchema);