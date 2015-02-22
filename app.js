
var express = require ("express"); // what allows to make an app web server
var path = require ("path"); // to resolve path
var bodyParser = require ("body-parser");
var csv = require ("ya-csv");


var app = express (); // create a new express application


// which should be using a static web directory: source of all the static content
// location for images, html files:
app.use (express.static (path.join (__dirname, "")));
app.use (bodyParser.urlencoded({extended:true}))


app.get ("/", function (request, response){
    console.log ("Responding to /");
    response.sendFile (path.join (__dirname, "index.html"));
});

// catching get requests: http.address/hello
app.get ("/hello", function (request, response){
    console.log ("Responding to /hello");
    response.sendFile (path.join (__dirname, "onions.html"));
});

// catching get requests: http.address/booking
app.post ("/booking", function (request, response){
    console.log ("Responding to /booking");
    //response.send ("Hello " + request.body.fullName);
    var full_name = request.body.fullName;
    var e_mail = request.body.email_address;

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    if (isEmpty(full_name) || isEmpty(e_mail)) {
        response.send ("Please make sure you enter a name while making bookings.");
        console.log (full_name + "'s information missing.");

    } else {
        var csv_table = csv.createCsvFileWriter("bookings.csv", {"flags": "a"}); // a from append
        var data_row = [full_name, e_mail];

        csv_table.writeRecord(data_row);
        csv_table.writeStream.end();

        response.send ("Thanks " + full_name + ", your booking is confirmed.");
        console.log (full_name + "'s booking recorded");
    }


});

// 80 is default for http on a running server
// 127.0.0.1 is the address of any local machine
var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Bob's Diner web app listening at http://%s:%s", host, port);
});