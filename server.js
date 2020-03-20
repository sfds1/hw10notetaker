// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

var fs = require("fs");

var db;

fs.readFile("./db/db.json", 'utf8', function(err,data){
  db = JSON.parse(data)
})

// Sets up the Express App
// =============================================================
var app = express();

// this is for the html to production
// this is to tell HEROKU to give a port that is for this particular app
// If the value "process.env.PORT" is false, then use 3000
// If in production, then "process.env.PORT" = true
var PORT = process.env.PORT || 3000;


// Sets up the Express app to handle data parsing
// Need this to get req.body in the app.post
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// this gives a link to all the files in the public folder
app.use(express.static('public'));



// Routes
// =============================================================

// Basic route that sends the user to the notes page
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, 'public','notes.html'));
});


//   Displays all the notes in the db.json file
app.get("/api/notes", function(req, res) {
  return res.json(db);
});


// Create New note
app.post("/api/notes", function(req, res) {

  var newNote = req.body;
  console.log(newNote);

// Add note to db.json file
// read the id of the last element in the array 

var nextID = 1;
if (db.length !== 0){
  nextID = (db[db.length-1].id) +1;
};

// then you increase in 1 
// then yyou add this ide to the object before the push
    db.push({id:nextID, ...newNote});

    fs.writeFile("./db/db.json",JSON.stringify(db), function(err, data){
      res.json(true);
    });

  
 
});

// clears the note   api/notes/5
app.delete("/api/notes/:id", function(req, res) {
// db   you nned to eliminate from array the note with the id comiing in the url

var newDB = db.filter(note=> note.id !== parseInt(req.params.id))
console.log(newDB)
db = newDB
// write
fs.writeFile("./db/db.json",JSON.stringify(db), function(err, data){
  res.json(true);
});

});


// Basic route that sends the user first to the index page
// The * is a wildcard so if anyone goes to a random link it will always go to the index.html
// __dirname will give the directory tree where the file is in
// this has to be the last one as if it is earlier then the other routes after it will not work
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
