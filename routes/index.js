const e = require('express');
var express = require('express');
var router = express.Router();
const projects = require("../public/data/projects");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home' });
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About us' });
});

router.get('/projects', function(req, res, next) {
    res.render('projects', { title: 'My projects', projects: projects });
});

router.get('/services', function(req, res, next) {
    res.render('services', { title: 'Services' });
});

router.get('/resume', function(req, res, next) {
    res.render('resume', { title: 'My Resume' });
});

router.get('/project/:slug', function(req, res, next) {

    myproject = projects.filter((e) => {
        return e.slug == req.params.slug;
    })

    res.render('project', { title: myproject[0].title, project: myproject[0] });
});

router.get('/contact', function(req, res, next) {
    if (req.query.name) {

        res.render('contact', { title: 'Thank you', isform: true });
    } else {
        res.render('contact', { title: 'Contact', isform: false });
    }
});



module.exports = router;