//Create app using express.js
const port = process.env.PORT || 3000;
const express = require("express");
const body_parser = require("body-parser");
const path = require("path");
// const creds = require("./creds.json");
const http = require("http");
const app = express();
const server = http.createServer(app);
const dir = path.join(__dirname, "../");

// const api_key = process.env.api_key || creds.api_key;
// const api_secret = process.env.api_secret || creds.api_secret;

app.use(express.static(dir));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.listen(port, () => console.log("Content Tool started on port " + port));

//Post to the appropriate file depending on the req.body.id value
app.post("/server", function(req, res) {
    const api_key = req.body.creds.api_key;
    const api_secret = req.body.creds.api_secret;
    const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

    if (req.body.id == "import") {
        const all_content = req.body.data;
        all_content.forEach(content => {
            if (content.tags) {
            content.tags = content.tags.split(",");
                console.log(content.tags);
                content.tags.forEach(tag => {
                    if (tag.indexOf("|") != -1) {
                        tag = tag.replace(/\|/g, ",");
                        tag = tag.replace(" ", "");
                        console.log(tag);
                        content.tags = tag.split(",");
                    }
                    else {
                        console.log("Single tag.");
                    }
                })
            }

            if (content.inventory) {
                content.inventory = parseInt(content.inventory);
                if (content.inventory == NaN) {
                    delete content.inventory;
                }
            }

            else {
                delete content.inventory;
            }

            if (content.location) {
                content.location = content.location.split(",");
                    content.location.forEach(location => {
                        if (location.indexOf("|") != -1) {
                            location = location.replace(/\|/g, ",");
                            location = location.replace(" ", "");
                            content.location = location.split(",");
                            if (content.location.length > 2) {
                                delete content.location;
                            }
                        }
                        else {
                            delete content.location;
                        }
                    })
                }

            else {
                delete content.location;
            }

            if (content.price) {
                content.price = parseInt(content.price);
            }

            if (content.thumb || content.full) {
                content.images = {};
                if (content.full) {
                    content.images.full = {};
                        content.images.full.url = content.full;
                        delete content.full;
                }
                if (content.thumb) {
                    content.images.thumb = {};
                        content.images.thumb.url = content.thumb;
                        delete content.thumb;
                }
            }

            sailthru.apiPost("content", 
                content,
            function(err, response) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(response);
                }
            });
        })
    }
    else if (req.body.id == "delete") {
        const all_content = req.body.data;
        all_content.forEach(content => {
            sailthru.apiDelete("content", {
                url: content.url
            },
            function(err, response) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(response);
                }
            });
        })
    }
    else if (req.body.id == "export") {
        const data = [];
        sailthru.apiGet("content", {
            items: 1000
        },
        function(err, response) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                const all_content = response.content;
                all_content.forEach(content => {
                    const content_data = {};
                    content_data.url = content.url;
                    content_data.date = content.date.replace(/,/g, " ");
                    if (content.title) {
                        content_data.title = content.title.replace(/,/g, " - ");
                    }
                    else {
                        content_data.title = "";
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
                    data.push({"url":content_data.url,"title":content_data.title, "date":content_data.date,"views":content_data.views,"tags":content_data.tags});
                });
                res.send(JSON.stringify(data));
            }
        });
    }
});