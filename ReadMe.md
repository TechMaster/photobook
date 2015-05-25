
1. Brew info postgresql
2. postgres -D /usr/local/var/postgres
3. Login as administrator of Postgresql, create database "photobook". Let owner is tom.
`CREATE DATABASE photobook
  WITH ENCODING='UTF8'
       OWNER=tom
       CONNECTION LIMIT=-1;
`
4. Create new table "photo"
`CREATE TABLE photo
(
  id serial NOT NULL, -- Unique ID of photo
  title character varying(255),
  path character varying(255),
  CONSTRAINT "Photo_PK" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE photo
  OWNER TO tom;
COMMENT ON COLUMN photo.id IS 'Unique ID of photo';`
5. Create Node.js application:
*. Create folder Server: mkdir server
*. express photobook
*. cd photobook && npm install
*. create nodemon to debug and run
*. add postgresql module to Node.js npm install --save pg

6. Add following lines to app.js
var apis = require('./routes/api');
app.use('/api', apis);

7. Create sample record in table photo
8. Run nodemon and GET http://localhost:3000/api/photo

10. To support Nunjucks
npm install nunjucks --save
Append app.js
`var nunjucks = require('nunjucks');
var env = nunjucks.configure(app.get('views'), {
  autoescape: true,
  express:    app
});
app.set('view engine', 'html');`
commend out this line
`app.set('view engine', 'jade');`

11. Install Twig plugin 

12. Tell different between form-data vs x-www-form-urlencoded
http://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
At beginning, only x-www-form-urlencoded works but not form-data
13. Use formidable to allow binary upload
npm install formidable@latest --save

14. in api.js 
const formidable = require('formidable'), http = require('http'), util = require('util');
//POST: Tạo một bản ghi
router.post('/photo', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    }); 
});
