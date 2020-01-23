var express     = require("express"),
    app         = express(),
    path        = require("path"),
    crypto      = require("crypto"),
    mongoose    = require("mongoose"),
    Web3        = require("web3"),
    flash       = require("connect-flash"),
    Ad          = require("./models/ad"),
    Info        = require("./models/info"),
    multer      = require("multer"),
    GridFsStorage = require("multer-gridfs-storage"),
    Grid        = require("gridfs-stream"),
    methodOverride = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    bodyParser = require("body-parser");
    
//mongoose.Promise = global.Promise;
const mongoURI = 'mongodb://localhost/rewardBasedAd2'

 mongoose.connect("mongodb://localhost/rewardBasedAd2", { useNewUrlParser: true });



const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true });

app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");
app.use(methodOverride('_method'));

// var adSchema = new mongoose.Schema({
//     name: String,
//     img: String,
//     desc: String
// });

//MIDDLEWARE
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret: "Reward Based Ad System",
    resave: false,
   saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //User.authenticate() is a method which comes with the passport-local-mongoose package
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.use(new LocalStrategy(UserP.authenticate())); //User.authenticate() is a method which comes with the passport-local-mongoose package
// passport.serializeUser(UserP.serializeUser());
// passport.deserializeUser(UserP.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error   = req.flash("error");
   res.locals.success   = req.flash("success");
   next();
});


// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }

        

       
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          metadata  : req.user.username
        };
        //console.log(fileInfo)
        resolve(fileInfo);
      });
    });
  }
  
  
});


// console.log(files)
const upload = multer({ storage });

// @route GET /
// @desc Loads form
// app.get('/register/upload', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       res.render('attachments', { files: false });
//     } else {
//       files.map(file => {
//         if (
//           file.contentType === 'image/jpeg' ||
//           file.contentType === 'image/png'
//         ) {
//           file.isImage = true;
//         } else {
//           file.isImage = false;
//         }
//       });
//       res.render('attachments', { files: files });
//     }
//   });
// });

// // @route POST /upload
// // @desc  Uploads file to DB
// app.post('/register/upload', upload.single('file'), (req, res) => {
//   // res.json({ file: req.file });
//   res.redirect('/register/upload');
// });


// // @route GET /files
// // @desc  Display all files in JSON
// app.get('/files', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         err: 'No files exist'
//       });
//     }

//     // Files exist
//     return res.json(files);
//   });
// });

// // @route GET /files/:filename
// // @desc  Display single file object
// app.get('/files/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }
//     // File exists
//     return res.json(file);
//   });
// });

// // @route GET /image/:filename
// // @desc Display Image
// app.get('/image/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }

//     // Check if image
//     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//       // Read output to browser
//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.status(404).json({
//         err: 'Not an image'
//       });
//     }
//   });
// });

// // @route DELETE /files/:id
// // @desc  Delete file
// app.delete('/files/:id', (req, res) => {
//   gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
//     if (err) {
//       return res.status(404).json({ err: err });
//     }

//     res.redirect('/register/upload');
//   });
// });

// =======================================================================================================

app.get("/", function(req,res){
    res.render("landing");
})

app.get("/register/dashboard", isLoggedIn, function(req, res){
    console.log(req.user);
    // var currentUser=req.user;

    Ad.find({}, function(err, allAds){
       if(err){
           console.log(err);
       } else {
          res.render("dashboard",{ads:allAds, currentUser:req.user});
       }
    });
});

// app.get("/register/dashboard", isLoggedIn, function(req,res){
//     res.render("dashboard");
// })

app.get("/ads/:id", isLoggedIn, function(req, res){
   
   Ad.findById(req.params.id).exec(function(err, foundAd){
       if(err){
           console.log(err);
       }
       else{
            
            
            res.render("show",{ad:foundAd});
       }

   });

});


app.use(express.static(__dirname + '/public'));

app.get("/register/info",isLoggedIn, function(req, res){
    res.render("infoAdv");
})

app.post("/register/info",  function(req,res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var add = req.body.add;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var author = {
        id: req.user._id,   
        username: req.user.username
        
    }
    var newInfo = {fname:fname, lname:lname, add:add, city:city, state:state, zip:zip,author:author};
    Info.create(newInfo, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/login");
        }
    })
})

app.get("/register", function(req,res){
    res.render("registerAdv");
})

app.get("/register/publisher",function(req,res){
    res.render("publisher");
})
app.post("/register", function(req, res){
    
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("registerAdv");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/register/info");
        });
    });
});



//SHOW LOGIN PAGE
app.get("/login", function(req, res){
  res.render("loginAdv",{message: req.flash("error")});
});
app.post("/login", passport.authenticate("local",
{
    successRedirect: "/register/dashboard",
    failureRedirect: "/login"
    

}), function(req, res){

});


app.get('/register/advertiser', isLoggedIn, function(req,res){
    res.render("campaign1");
});

app.post("/register/advertiser", function(req,res){
    var name= req.body.name;
    var sDate= req.body.sDate;
    var eDate = req.body.eDate;
    var sTime = req.body.sTime;
    // var img = req.body.img;
    // var desc = req.body.desc;
    var lurl = req.body.lurl;
    var min = req.body.min;
    var max = req.body.max;
    var author = {
        id: req.user._id,   
        username: req.user.username
        
    }
    var newAd1 = {name:name,sDate:sDate,eDate:eDate,sTime:sTime,lurl:lurl,min:min,max:max, author:author};
    Ad.create(newAd1, function(err, newlyCreated){
        if(err){
            console.log(err);
            
        }
        
        else{
            res.redirect("/register/upload");
        }
    })
});


app.get('/register/upload', isLoggedIn, (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('attachments', { files: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('attachments', { files: files, currentUser:req.user });
      }
    });
  });
  
  // @route POST /upload
  // @desc  Uploads file to DB
  app.post('/register/upload', upload.single('file'), (req, res) => {
    // res.json({ file: req.file });
    res.redirect('/register/upload');
  });
  
  
  // @route GET /files
  // @desc  Display all files in JSON
  app.get('/files', isLoggedIn, (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
  
      // Files exist
      return res.json(files);
    });
  });
  
  // @route GET /files/:filename
  // @desc  Display single file object
  app.get('/files/:filename', isLoggedIn, (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // File exists
      return res.json(file);
    });
  });
  
  // @route GET /image/:filename
  // @desc Display Image
  app.get('/image/:filename', isLoggedIn, (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });
  
  // @route DELETE /files/:id
  // @desc  Delete file
  app.delete('/files/:id', isLoggedIn, (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
  
      res.redirect('/register/upload');
    });
  });
  



app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
})

function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

function checkAdOwnership(req, res, next){
     if(req.isAuthenticated()){
            Ad.findById(req.params.id, function(err, foundAd){
               if(err){
                   res.redirect("back");
               }  else {
                 
                if(foundAd.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
               }
            });
        } else {
            res.redirect("back");
        }
    }



app.listen(9000,  function(){
    
    console.log("server has started... ");
});