/**
 * Created by techmaster on 5/21/15.
 */
const express = require('express');
const router = express.Router();
const conString = "postgres://tom:123456@127.0.0.1/photobook";
const pg = require('pg');
const fs = require('fs');

const formidable = require('formidable'), http = require('http'), util = require('util');

//Return absolute path of folder that stores uploaded photos
function getAbsoluteFolder() {
    var postLastPath = __dirname.lastIndexOf('/');
    var rootDir = __dirname.substring(0, postLastPath);
    return rootDir + "/public/photos/";
}

function getRelativeFolder() {
    return "/photos/";
}

//GET: lấy toàn bộ danh sách các actor
router.get('/photo', function (req, res) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            res.end('error fetching client from pool');
            return;
        }
        client.query('SELECT id, title, path FROM photo;',
            function (err, result) {
                done();
                if (err) {
                    res.end('Error when querying');
                    return;
                }
                res.json(result.rows);
            });
    });
});

//POST: Tạo một bản ghi
router.post('/photo', function (req, res) {
    res.writeHead(200, {'content-type': 'text/plain'});
    var form = new formidable.IncomingForm();
    form.uploadDir = getAbsoluteFolder();
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {

        pg.connect(conString, function (err, client, done) {
            if (err) {
                res.end('error fetching client from pool');
                return;
            }
            client.query('INSERT INTO photo (title, oldfile) VALUES ($1, $2) RETURNING id',
                [fields.title, files.photo.name], function (err, result) {
                    done();
                    if (err) {
                        res.end('error when insert new actor');
                    } else {
                        //Get return ID from INSERT command
                        console.log(result.rows[0].id);
                        var newPath = form.uploadDir +  result.rows[0].id + "." + files.photo.name.split('.').pop();
                        fs.rename(files.photo.path, newPath, function (err) {
                            if (err) {
                                res.end('cannot rename file ' + files.photo.path);
                            }
                        });
                        res.end('done');
                    }
                });
        });

        res.end('Done');
    });
});


router.get('/photo/:id', function(req, res) {
    pg.connect(conString, function(err, client, done){
        if (err) {
            res.end('Error fetching client from pool');
        }
        client.query('SELECT id, title, oldfile FROM photo WHERE id = ($1);',
            [req.params.id],
            function(err, result) {
                done();
                if (err) {
                    res.end('Error when querying a photo');
                }
                if (result.rowCount >= 1) {
                    var photo = result.rows[0];
                    photo.path = getRelativeFolder() + photo.id + "." + photo.oldfile.split('.').pop();
                    res.json(photo);
                } else {
                    res.end('Photo is not found');
                }
            });
    });


});

router.delete('/photo/:id', function(req, res) {
    pg.connect(conString, function(err, client, done){
        if (err) {
            res.end('Error fetching client from pool');
        }

        client.query('SELECT id, oldfile FROM photo WHERE id = ($1);',
            [req.params.id],
            function(err, result) {
                done();
                if (err) {
                    res.end('Error when querying a photo');
                    return;
                }
                if (result.rowCount >= 1) {
                    var photo = result.rows[0];

                    var photopath = getAbsoluteFolder() + photo.id + "." + photo.oldfile.split('.').pop();
                    console.log(photopath);
                    fs.unlink(photopath, function(err) {
                        if (err) {
                            console.log('Failed to delete ' + photopath);
                        }
                    })
                } else {
                    res.end('Photo is not found');
                }
            });

        client.query('DELETE FROM photo WHERE id = ($1);',
            [req.params.id],
            function(err, result) {
                done();
                if (err) {
                    res.end('Cannot delete photo');
                } else {
                    res.end('Done');
                }
            });
    });

});
module.exports = router;