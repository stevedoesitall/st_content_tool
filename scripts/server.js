//Create app using express.js
const port = process.env.PORT || 3000;
const express = require("express");
const body_parser = require("body-parser");
const path = require("path");
const creds = require("./creds.json");
const http = require("http");
const app = express();
const server = http.createServer(app);
const dir = path.join(__dirname, "../");

const api_key = process.env.api_key || creds.api_key;
const api_secret = process.env.api_secret || creds.api_secret;

const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

app.use(express.static(dir));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.listen(port, () => console.log("Content Tool started on port " + port));

//Post to the appropriate file depending on the req.body.id value
app.post("/server", function(req, res) {
    // if (req.body) {
    //     console.log(typeof req.body.data, req.body.data);
    // }
    // else {
    const data = [];
    const vars = [];
    sailthru.apiGet("content", {
        items: 1000
    },
    function(err, response) {
        if (err) {
            console.log(err);
        }
            else {
                const all_content = response.content;
                all_content.forEach(content => {
                    const content_data = {};
                    content_data.url = content.url;
                    content_data.date = content.date.replace(/,/g, " ");
                    if (content.title) {
                        content_data.title = content.title.replace(/,/g, " ");
                    }
                    else {
                        content_data.title = "";
                    }

                    if (content.author) {
                        content_data.author = content.author.replace(/,/g, " ");
                    }
                    else {
                        content_data.author = "";
                    }

                    if (content.tags) {
                        content_data.tags = content.tags.toString().replace(/,/g, "|");
                    }
                    else {
                        content_data.tags = "";
                    }
                    if (content.views) {
                        content_data.views = content.views;
                    }
                    else {
                        content_data.views = 0;
                    }

                    if (content.vars) {
                        vars_string = JSON.stringify(content.vars);
                        content_data.vars = vars_string.replace(/,/g, "|").replace(/{/g, "").replace(/}/g, "");
                    }
                    else {
                        content_data.vars = "";
                    }

                    data.push({"url":content_data.url,"title":content_data.title, "author":content_data.author, "date":content_data.date,"views":content_data.views,"tags":content_data.tags, "vars":content_data.vars});
                });
                res.send(JSON.stringify(data));
            }
        });
    // }
});