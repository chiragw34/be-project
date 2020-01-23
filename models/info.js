var mongoose = require("mongoose");

var infoSchema= new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    add: String,
    cname: String,
    cvv: Number,
    cnumber: Number,
    exdate: Date,
    city: String,
    state: String,
    zip: Number,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Info", infoSchema);