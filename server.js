var express         = require('express')
,   app             = express()
,   path            = require('path')
,   mongoose        = require('mongoose')
,   bodyParser      = require('body-parser')
,   crypto          = require('crypto')
,   fs              = require('fs')
,   methodOverride  = require('method-override')
,   jwt             = require('jsonwebtoken');
;


mongoose.connection.on('open', function(ref) { 
    console.log('connected to mongodb');
});

mongoose.connection.on('error', function(err) {
   console.log('Could not connect to mongo db');
    console.log(err);
});

var userSchema = new mongoose.Schema({
    firstName   : String
,   lastName    : String
,   password    : String
,   email       : String
,   salt        : String    
});



var User = mongoose.model('User', userSchema);

mongoose./connect('mongodb://pawn:34erdfcv#$ERDFCV@ds053794.mongolab.com:53794/selu-acm-db');


app.use('/lib', express.static(__dirname + '/app/lib'));
app.use('/', express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({
    extended    : true
,   limit       : '50mb'
}));
app.use(bodyParser.json({
    limit       : '50mb'
}));
//app.use(methodOverride());


app.get('/favicon.ico', function(req, res) {
    res.sendFile(path.join(__dirname + '/favicon.ico'));
});

//this should be a get
app.post('/api/login', function(req, res) {
    User.findOne({ email: req.body.email}, function(err, user) {
       if(err) {
           throw err;
           console.log('error querying db');
       } 
       if(!user) {
           res.status(401).json({ success : false, message : 'User not found in DataBase'});
       }
       else if(user) {
           var hash = generateHash(req.body.password, user.salt);
           if(hash != user.password) {
               res.status(409).json({ success : false, message : 'User failed authentication incorrect password'});
           }
           else {
               var token = jwt.sign(user, 'superSecret', {
                  expiresIn: 1440  
               });
               
               var returnUser = ({ firstName : user.firstName, lastName : user.lastName, email : user.email, userId : user._id});
               
               res.status(200).json({ success : true, message : 'thankyou', user: returnUser, token : token});
           }
       }
    });
});


app.post('/api/register', function(req, res) {
    console.log('Post success!!');
    User.findOne({ email : req.body.email}, function(err, user) {
        var firstName   = sanitizeInput(req.body.firstName)
        ,   lastName    = sanitizeInput(req.body.lastName)
        ,   email       = sanitizeInput(req.body.email)
        ,   password    = req.body.password
        ;

        if(err) {
            throw err;
            console.log('error querying db');
        } else if(user) {
            //This shouldn't be an okay response
            res.status(200).send('User already exsists');
            console.log('User already exsists');
        } else if (!validEmail(email)) {
            res.status(403).send('Please submit a valid selu.edu email address');
            console.log('Invalid Email ' + email);
        } else {
            var salt = generateSalt();
            var hash = generateHash(password, salt);

            var newUser = new User({
                firstName   : firstName
            ,   lastName    : lastName
            ,   password    : hash
            ,   email       : email
            ,   salt        : salt
            });

            newUser.save(function(err) {
                if (err) throw err;
                console.log('User created!');
                res.status(201);
            });

            delete user;
        }
    });
});

app.post('/api/upload', function(req, res) {
 
    var token = req.body.token;
    
    if(token) {
        jwt.verify(token, 'superSecret', function(err, decode) {
           if(err) {
               res.status(403).json({ success : false, message : 'Failed to authenticate token'});
           }
            else {
                var fileName    = 'resumes/' + decode.lastName + '_' + decode.firstName + '_' + decode.Id + '.pdf'
                ,   contents    = req.body.file
                ;

                fs.writeFile(fileName, contents, 'binary', function(err) {
                    if (err) console.log(err);
                    else console.log('Resume received');
                });

                res.status(201).send('Resume uploaded')
            }
            
        });
    }
    else {
        res.status(403).json({ success : false, message : 'No token provided'});
        
    }
    
    
});

app.get('/api/files', function(req, res){
  fs.readdir('resumes/', function(err, files) {
    if (err){
     res.status(404).json({success: false, message: 'Failed to retrieve files'});
     return; 
    } 
    res.status(200).json({success: true, message: 'We made it', fileList: files});
  });
});


app.all('/*', function (req, res) {
    res.status(200).sendFile(path.join(__dirname + '/app/index.html'));
    console.log('Success!');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Magic happening on port ' + port);
    
});


function generateHash(password, salt) {
    var hash = crypto
            .createHash('sha256')
            .update(salt + password)
            .digest('base64');
    
    return hash;
}

function generateSalt() {
   return crypto.randomBytes(16).toString('base64');
}

function sanitizeInput(input) {
    return input.replace('<', '&lt;').replace('>', '&gt;');
}

function validEmail(email) {
    return /^([\w.]+)@selu.edu$/g.test(email);
}
