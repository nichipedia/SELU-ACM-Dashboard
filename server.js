var express     = require('express')
,   app         = express()
,   path        = require('path')
,   mongoose    = require('mongoose')
,   bodyParser  = require('body-parser')
,   crypto      = require('crypto')
,   fs          = require('fs')
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

mongoose.connect('mongodb://pawn:34erdfcv#$ERDFCV@ds053794.mongolab.com:53794/selu-acm-db');


app.use('/lib', express.static(__dirname + '/app/lib'));
app.use('/', express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({
    extended    : true
,   limit       : '50mb'
}));
app.use(bodyParser.json({
    limit       : '50mb'
}));


app.get('/favicon.ico', function(req, res) {
    res.sendFile(path.join(__dirname + '/favicon.ico'));
});

app.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/index.html'));
    console.log('Success!');
});

app.post('/api/login', function(req, res) {
    
    
    
});


app.post('/api/register', function(req, res) {
    
    console.log('Post success!!');
    User.find({ email : req.body.email}, function(err, user) {
        if(err) {
            console.log('error querying db');
            throw err;
        } else if(user.length != 0) {
            res.send('User already exsists');
            console.log('User already exsists');
        } else {
            var salt = generateSalt();
            var password = encrypt(req.body.password, salt);
            var newUser = new User({
                firstName   : req.body.firstName
            ,   lastName    : req.body.lastName
            ,   password    : password
            ,   email       : req.body.email
            ,   salt        : salt
            });

            newUser.save(function(err) {
                if (err) throw err;
                console.log('User created!');
            });

            delete user;

            User.findOne( {email : req.body.email}, function(err, user) {
                console.log('User created this is your unique user ID: ' + user._id);
                res.send('User created ' + ' your username is: ' + user.userName + ' and this is your unique user ID: ' + user._id);
            });
        }
    });
});

app.post('/api/upload', function(req, res) {
    var fileName    = __dirname + '/resumes/' + req.body.name 
    ,   contents    = req.body.file
    ;

    fs.writeFile(fileName, contents, 'binary', function(err) {
        if (err) console.log(err);
        else console.log('Resume received');
    });

    res.send('Resume uploaded')
});

function encrypt(plainText, salt) {
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
}

function generateSalt() {
   return crypto.randomBytes(16).toString('base64');
}

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Magic happening on port ' + port);
    
});