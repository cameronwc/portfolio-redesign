const express = require("express");

var app = express();

const PORT = process.env.PORT || 5000
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/portfolio", function (req, res) {
    res.render("portfolio")
})

app.listen(PORT, function () {
    console.log("Portfolio Launched on localhost:5000");
});