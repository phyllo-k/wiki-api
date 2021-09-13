const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const env = process.env.NODE_ENV || "development";
const config = require("./config.js")[env];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.on("ready", function () {
    app.listen(process.env.PORT || 3000, function () {
        console.log("Server is running...");
    });
})
config.database.connect("wikiDB");
mongoose.connection.once("open", function () {
    app.emit("ready");
});

//Article API
const articleSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: String
});
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, articles) {
            (err) ? res.send(err) : res.send(articles);
        })
    })

    .post(function (req, res) {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        article.save(function (err) {
            (err) ? res.send(err) : res.send("Success: Added a new article.");
        })
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            (err) ? res.send(err) : res.send("Success: Deleted all articles.");
        })
    })
;

app.route("/articles/:title")
    .get(function (req, res) {
        Article.findOne({ title: req.params.title }, function (err, article) {
            (err) ? res.send(err) : res.send(article);
        })
    })

    .put(function (req, res) {
        if (!req.body.title) {
            res.send("ERROR: Title is missing!");
        } else {
            Article.replaceOne({ title: req.params. title }, { title: req.body.title, content: req.body.content },  function (err, results) {
                (err) ? res.send(err) : res.send(results);
            })
        }
    })

    .patch(function (req, res) {
        Article.updateOne({ title: req.params. title }, { $set: { title: req.body.title, content: req.body.content }}, function (err, results) {
            (err) ? res.send(err) : res.send(results);
        })
    })

    .delete (function (req, res) {
        Article.deleteOne({ title: req.params.title }, function (err) {
            (err) ? res.send(err) : res.send("Success: Deleted " + req.params.title + " article.");
        })
    })
;
