var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    request             = require("superagent"),
    cookieParser        = require("cookie-parser"),
    expressSession      = require("express-session"),
    mongoose            = require("mongoose"),
    User                = require("./models/user"),
    passport            = require("passport"),
    passportLocal       = require("passport-local"),
    passportLM          = require("passport-local-mongoose");
    validator           = require("express-validator"),
    mailchimpInstance   = 'insert your instanceId here',
    listUniqueId        = 'insert your list id here',
    mailchimpApiKey     = 'insert your mailchimp api key here';

app.set("view engine", 'ejs');
//mongodb for desktop Testing
mongoose.connect("mongodb://localhost/launchpage-example")
app.use(bodyParser.json());
app.use(validator());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());
app.use(express.static('public'));
app.use(cookieParser());
app.use(expressSession({
  secret: 'a9ds8f98087asdytf87t6fagfuasd7zzccv7887',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 600},

}))
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res){
  // req.session.errors = null;
  res.render('landing', { errors: req.session.errors, success: req.session.success});



});

app.post('/', function (req, res, next) {

  req.assert('firstName', 'Please enter a First Name longer than 2 characters and not more than 15').len(2, 15);
  req.assert('lastName', 'Most people have a last names between 2 and 16 characters long').len(2, 16);
  req.assert('email', 'A valid email is required').isEmail();
  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      var errors = result.array();
      req.session.errors = errors;
      req.session.success = false;
      res.render('landing',  { errors: req.session.errors,
                              success: req.session.success,
                              exists: req.session.exists});
    } else{
    req.session.success = true;


    var username  =   req.body.email;
    User.findOne({username:username}, function(err, user, next){
      console.log(user);
      if(user){
        req.session.exists = true;
        res.render("landing", { errors: req.session.errors,
                                success: req.session.success,
                                exists: req.session.exists});
      } else if(!user){
          var email     =  req.body.email,
              username  =  req.body.email,
              firstName =  req.body.firstName,
              lastName  =  req.body.lastName,
              newUser   =  {username:username, email: email};
          User.create(newUser, function(err, data, next){
          if(err){
            console.log(err);
            res.redirect('/*');
          }

      request
      .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
      .send({
        'email_address': req.body.email,
        'status': 'subscribed',
        'merge_fields': {
          'FNAME': req.body.firstName,
          'LNAME': req.body.lastName
        }
      })
      .end(function(err, response) {
        if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
            res.render('landing',  { errors: req.session.errors,
                                    success: req.session.success,
                                    exists: req.session.exists});
        } else {
          res.redirect('/');
        }
      });
        });

      }
    })
  }
    });

})

app.get('/*', function(req, res){
    res.render('404.ejs')
})

// app.listen(process.env.PORT, process.env.IP, function(){console.log("app started")})

//for desktop testing
app.listen(3000, function () {
  console.log('Example App Running on Port 3000!')
})
