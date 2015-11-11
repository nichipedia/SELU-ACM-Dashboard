var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var methodOverride = require('method-override');
   




mongoose.connection.on('open', function(ref) { 
    console.log('connected to mongodb');
});

mongoose.connection.on('error', function(err) {
   console.log('Could not connect to mongo db');
    console.log(err);
});

var userSchema = new mongoose.Schema({
     firstName: String
    ,lastName: String
    ,password: String
    ,email: String
    ,salt: String
    
});



var User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://pawn:34erdfcv#$ERDFCV@ds053794.mongolab.com:53794/selu-acm-db');


app.use('/lib', express.static(__dirname + '/app/lib'));
app.use('/', express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
//app.use(methodOverride());

app.get('/home', function (req, res) {
    res.status(200).sendFile(path.join(__dirname + '/app/index.html'));
    console.log('Success!');
});

app.post('/api/login', function(req, res) {
    User.findOne({ email: req.body.email}, function(err, user) {
       if(err) {
           throw err;
           console.log('error querying db');
       } 
        var userPassword = encrypt(req.body.password, user.salt);
        if(userPassword != user.password) {
            res.status(403);
            console.log('Password incoorect');
        }
        else {
            res.status(200).json({ "email" : user.email, "firstName" : user.firstName, "lastName" : user.lastName, "token" });
        }
        
        
    });
    
    
});


app.post('/api/register', function(req, res) {
    console.log('Post success!!');
    User.find({ email : req.body.email}, function(err, user) {
            if(err) {
                throw err;
                console.log('error querying db');
            }
            if(user.length != 0) {
                res.status(200).send('User already exsists');
                console.log('User already exsists');
            }
      
            else {

            var salt = generateSalt();
            
            var hash = crypto
                    .createHash('sha256')
                    .update(salt + req.body.password)
                    .digest('base64');

           
            
            var newUser = new User({
                 firstName: req.body.firstName
                ,lastName: req.body.lastName
                ,password: hash
                ,email: req.body.email
                ,salt: salt
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

/*function encrypt(plainText, salt) {
    var algorithm = 'aes-256-ctr';
    var cipher = crypto.createCipher(algorithm, salt);
    var crypted = cipher.update(plainText, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;


}

function decrypt(encryptedText, salt){
    var algorithm = 'aes-256-ctr';
    var decipher = crypto.createDecipher(algorithm, salt)
    var dec = decipher.update(encryptedText,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}*/

function generateSalt() {
   return crypto.randomBytes(16).toString('base64');
}

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Magic happening on port ' + port);
    
});
