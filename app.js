/* File name - app.js, 
            Student’s Name - Kanishk Sachdeva, 
            StudentID - 301182362, 
            Date  3rd October 2021*/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Passport Authentication
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var flash = require("connect-flash");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const port = 3000;


const { User } = require('./models/User');

// MongoDb setup
mongoose.connect("mongodb+srv://kanu00047:Theindian%2337@cluster0.4sl2b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport Session holder
app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// BodyParser
app.use(express.json({ extended: true }));
app.use(express.urlencoded({
    extended: false
}))


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error pages
    res.status(err.status || 500);
    res.render('error');
});

// Passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, done) {
        console.log(email, password);
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log(user);
            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    if (user) {
        return done(null, user.id);
    }
    return done(null, false);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) return done(null, false);
        return done(null, user);
    })
});


function isAuthenticated(req, res, done) {
    if (req.user) {
        return done();
    }
    return res.redirect('/users/login')
}

module.exports = app;