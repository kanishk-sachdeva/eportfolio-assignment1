const e = require('express');
var express = require('express');
var router = express.Router();
const projects = require("../public/data/projects");
const { Contact } = require('../models/Contact');
const { Projects } = require('../models/Projects');

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Home' });
});

router.get('/about', function (req, res, next) {
    res.render('about', { title: 'About us' });
});

router.get('/projects', function (req, res, next) {
    Projects.find({}).sort([['position', 1]]).exec((err, data) => {
        if (data != null) {
            res.render('projects', { title: 'My projects', projects: data });
        } else {
            res.redirect('/');
        }
    })
    
});

router.get('/services', function (req, res, next) {
    res.render('services', { title: 'Services' });
});

router.get('/resume', function (req, res, next) {
    res.render('resume', { title: 'My Resume' });
});

router.get('/project/:slug', function (req, res, next) {

    Projects.findOne({slug:req.params.slug}, (err, data) => {
        if (data != null ){
            res.render('project', {title: data.title, project: data});
        }else {
            res.redirect('/projects');
        }
    });

});

router.get('/newproject', (req,res) => {
    const newProject = new Projects({
        title: "Deal Scraper and Link Shortify Python Projects",
        description: "Some of my projects made in python",
        imagelink: "/images/python.jpg",
        intro: "Project 1 (Deal Scraper) : A python app built in selenium and linked with database to scrap deals and save it. Moreover, these deals scraped from amazon, flipkart and 20+ more ecommerce sites to telegram channel and WordPress website using xmlrpc<br>Project 2 (Link Shortify): A link shortener flask app built with love in python. This webapp can shorten big links into small one such as github.com. It is simple to install and use",
        data: [
            "<h6 style='color: #18d26e;'>Technologies Used: <p class='text-white'>Flask, Python, MongoDB, Firebase, Xmlrpc, wordpress-api, Firestore and many more..</p></h6>",
            "<h6 style='color: #18d26e;'>Github Link (Link Shortify): <a href='https://github.com/kanishk-sachdeva/Link-Shortify'>https://github.com/kanishk-sachdeva/Link-Shortify</a></h6>",
            "<h6 style='color: #18d26e;'>Github Link (Deal Scraper): <a href='https://github.com/kanishk-sachdeva/Deal-Scraper'>https://github.com/kanishk-sachdeva/Deal-Scraper</a></h6>",
        ],
        githublink: "https://kanishk-sachdeva.github.io/Deal-Scraper/",
        slug: "pythonprojects",
        position: 6,
    });
    newProject.save();
    res.redirect('/projects');
});

router.get('/contact', function (req, res, next) {
    if (req.query.name) {

        res.render('contact', { title: 'Thank you', isform: true });
    } else {
        res.render('contact', { title: 'Contact', isform: false });
    }
});

function isAuthenticated(req, res, done) {
    if (req.user) {
        return done();
    }
    return res.redirect('/users/login')
}

router.post('/logout', function (req, res) {
    req.logOut();
    res.redirect('/users/login')
})

router.route('/update/:id')
  .get((req, res) => {
    const id = req.params.id;
    Contact.findById(id, (err, tasks) => {
      if (err) return res.send(500, err);
      res.render('dashboard/updateForm', { data: tasks })
    })
  })
        .post((req, res) => {
          const id = req.params.id;
          Contact.findByIdAndUpdate(id, {
            name: req.body.name,
            phone: req.body.Phone,
            email: req.body.email
          }).catch(err => console.log(err));
          res.redirect("/dashboard");
        });
    

router.get('/dashboard', isAuthenticated, function (req, res, next) {

    Contact.find({}, (err, tasks) => {
        res.render('dashboard/index', { contacts: tasks });
    })

})

router.post('/addcontact', function (req, res, next) {
    const { name, email, Phone } = req.body;

    const newContact = new Contact({
        name,
        email,
        phone: Phone,
    });
    newContact.save()
        .then(console.log("Contact saved"))
        .catch(err => console.log(err));
    res.redirect('/dashboard');

})

router.route("/delete/:id").get((req, res) => {
    const id = req.params.id;
    Contact.findByIdAndRemove(id, err => {
      if (err) return res.send(500, err);
      res.redirect("/dashboard");
    });
  });


module.exports = router;