const express = require('express');
const app = express();

var urlToImage = require('url-to-image');
var fs = require('fs');


var advertiser1 =  1;

var advertiser2 = 2;

//var advertisers_read = fs.readFileSync("advertisers.json");

var advertisers = [  ];//JSON.parse(advertisers_read);

//console.log(advertisers[0].inbid);

var intervals = [];

var bids = [0,0,0];

var nxtBidms = [0,0,0];

var index = 0;

var clicks = 0;

var cors = require('cors');

// use it before all route definitions
app.use(cors({origin: 'null'}));

var mongoose    = require("mongoose"),
    Ad          = require("./models/ad")

mongoose.connect("mongodb://localhost/rewardBasedAd", { useNewUrlParser: true });

Ad.find({},(err,docs)=>{
   // console.log(docs);
    for(i=0;i<docs.length;i++)
    {
        advertisers[i] = docs[i];

        // console.log(advertisers[i].img);
    }

});



 
 //console.log(count);
app.get('/adreq',(req,res) =>
{
     var count = 0;
 
             Ad.countDocuments({}, function(err, count1){
                 if(err){
                     console.log(err);
                 }
                 
                 count = count1;
             });
             
    

    console.log(advertisers.length);

    for(var i=0 ;i<advertisers.length;i++)
    {
        

      // console.log(advertisers[i].inbid);

        bids[i] = advertisers[i].min;

        nxtBidms[i] = 50;
    }
    
    console.log("initial bids" + bids);

    var highest_bid = Math.max.apply(Math, bids);;

    //console.log(highest_bid);

    for(i = 0; i < count; i++ )
    {
       
        (
            function(i){

              intervals[i] = setInterval(
                    function(){

                      // console.log('working');

                        if(bids[i] < highest_bid)
                        {

                            bids[i] = highest_bid + (bids[i]/2);

                            highest_bid = bids[i];

                            console.log(bids[i]);
                        }

                    },nxtBidms[i] 


                )

            }

        )(i);
        
    }

    

    
    

    //console.log(intervals);
                   
    
    function display(advertiser){

            for(i = 0; i<count ; i++)
            {
                clearInterval(intervals[i]);
            }

             index = bids.indexOf(Math.max.apply(Math,bids));
            
          console.log('winner is ' + advertisers[index].name);

        

            
        res.json({title:"api",message:advertisers[index].img});
    }

    setTimeout(display,300);

});



app.post('/click',(req,res) => {


    console.log('clicked');

    //res.writeHead(200,advertisers[index].lurl);

    console.log('update the data base');


    console.log(advertisers[index].lurl);
    res.writeHead(301,
        {Location:"http://"+ advertisers[index].lurl}
      );
      res.end();
      
     ;
      
     

});




app.listen(4500, (err) => {
    
    if(err){
        console.log(err);
    }

    console.log("listening to 8000");
    
});