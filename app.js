var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override"),
    port = process.env.PORT || 3000

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
//------------------Connect to DB

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://green:12345db@cluster0-zrds1.gcp.mongodb.net/camp?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
//--------------------
// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true  }
// );
// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log("MongoDB database connection established successfully");
// })

//--------------------
const MONGODB_URI = 'mongodb+srv://green:12345db@cluster0-zrds1.gcp.mongodb.net/camp?retryWrites=true&w=majority'
//useMongoClient: true
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
// How to know if mongose is connected??? Add a listener
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});
//--------------------
//local
//mongoose.connect("mongodb://localhost/yelp_camp_v9");
//online db mongodb+srv://green:<password>@cluster0-zrds1.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority
// mongoose.connect("mongodb+srv://green:12345db@cluster0-zrds1.gcp.mongodb.net/camp?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true }).then(()=> { console.log('successful connection')

// }).catch(err=>{console.log('ERROR: ');
			   
// 			  })

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(port, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});