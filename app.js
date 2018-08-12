var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "localhost",
  user: "donggyu2",
  password: "nlcfjb",
  database: "mysql_tut"
});
conn.connect();
//middleware
app.use("/media", express.static(__dirname + "/media"));
app.use(bodyParser.json()); //for json type
app.use(bodyParser.urlencoded({ extended: true })); //for form type

//settings
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/topic/delete/:id", (req, res) => {
  var id = req.params.id;
  var sql = "DELETE FROM topic WHERE id=?";
  conn.query(sql, [id], (err, results, fields) => {
    if (err) console.log(err);
    else {
      res.redirect("/topic");
    }
  });
});

app.get("/topic/update/:id", (req, res) => {
  var id = req.params.id;
  var sql = "SELECT * FROM topic WHERE id = ?";
  conn.query(sql, [id], (err, results, fields) => {
    if (err) console.log(err);
    else {
      res.render("edit", { topic: results[0] });
    }
  });
});

app.post("/topic/edit/:id", (req, res) => {
  var id = req.params.id;
  console.log(req.body.title);
  var title = req.body.title;
  var author = req.body.author;
  var desc = req.body.description;
  var sql = "UPDATE topic SET title=?, author=?, description=? WHERE id =?";
  var post = [title, author, desc, id];
  conn.query(sql, post, (err, results, fields) => {
    if (err) console.log(err);
    else {
      res.redirect(`/topic/${id}`);
    }
  });
});

app.get("/topic/write", (req, res) => {
  res.render("form");
});

app.post("/topic/new", (req, res) => {
  var title = req.body.title;
  var author = req.body.author;
  var desc = req.body.description;
  var sql = "INSERT INTO topic (title, author, description) VALUES (?,?,?)";
  var post = [title, author, desc];
  conn.query(sql, post, (err, results, fields) => {
    if (err) console.log(err);
    else {
      console.log(results);
      var id = results.insertId;
      res.redirect(`/topic/${id}`);
    }
  });
});

app.get(["/topic", "/topic/:id"], (req, res) => {
  var id = req.params.id;
  var sql = "SELECT id, title FROM topic";
  conn.query(sql, (err, results, fields) => {
    if (err) console.log(err);
    else {
      if (id) {
        var sql =
          "SELECT id, description, title, author FROM topic WHERE id =?";
        var topics = results;
        conn.query(sql, [id], (err, results, fields) => {
          if (err) console.log(err);
          else {
            res.render("description", { topics: topics, topic: results });
          }
        });
      } else {
        res.render("app", { topics: results });
      }
    }
  });
});

app.listen(8081, () => {
  console.log("Server listening at 8081 port");
});
