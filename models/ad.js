var mongoose = require("mongoose");

var adSchema = new mongoose.Schema({
    name: String,
    sDate: Date,
    eDate: Date,
    sTime: String,
    img1: { data: Buffer, contentType: String },
    // desc: String,
    lurl:String,
    min: Number,
    max: Number,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    power:Number
});

module.exports = mongoose.model("Ad",adSchema);