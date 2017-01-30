var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/bugem');

router.get('/', function(req, res) {
    var collection = db.get('letters');
    collection.find({}, function(err, letters) {
        if (err) throw err;
        res.json(letters);
    });
});

router.post('/', function(req, res) {
    var collection = db.get('letters');
    collection.insert(
        {
            author_id: req.body.author_id,
            title: req.body.title,
            body: req.body.body
        },
        function(err, letter) {
            if (err) throw err;
            res.json(letter);
        }
    );
});

router.get('/:id', function(req, res) {
    var collection = db.get('letters');
    collection.findOne({_id: req.params.id}, function(err, letter) {
        if (err) throw err;

        res.json(letter);
    });
});

router.put('/:id', function(req, res) {
    var collection = db.get('letters');
    collection.update(
        {_id: req.params.id},
        {
            author_id: req.body.authori_id,
            title: req.body.title,
            body: req.body.body
        },
        function(err, letter) {
            if (err) throw err;

            res.json(letter);
        }
    );
});

router.delete('/:id', function(req, res) {
    var collection = db.get('letters');
    collection.remove({ _id: req.params.id }, function(err, letter) {
        if (err) throw err;
        res.json(letter);
    });
});

module.exports = router;
