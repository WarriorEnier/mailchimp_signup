const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");
require('dotenv').config();

const app = express();
const apikey = process.env.API_KEY;
const audiId = process.env.AUDI_ID;
/* const apikey = "ab22ae682a0cb0fe1b94cd99a6ba0b84-us14";
const audiId = "e86221f0a7"; */

const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const { name, last, email } = req.body;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
          LNAME: last,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = `https://us14.api.mailchimp.com/3.0/lists/${audiId}`;
  const options = {
    method: "POST",
    auth: `tony:${apikey}`,
  };
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      const resJson = JSON.parse(data);
      if (resJson.new_members && resJson.new_members.length > 0 && response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/success", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Corriendo en el puerto 3000");
});
