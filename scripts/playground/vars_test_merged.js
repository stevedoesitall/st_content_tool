//Create app using express.js
const port = process.env.PORT || 3000;
const express = require("express");
const body_parser = require("body-parser");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app);
const dir = path.join(__dirname, "../");

app.use(express.static(dir));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.listen(port, () => console.log("Content Tool started on port " + port));

//Post to the appropriate file depending on the req.body.id value
app.post("/server", function(req, res) {
    const content_obj = {};
    content_obj.items = 1000;

    const api_key = req.body.creds.api_key;
    const api_secret = req.body.creds.api_secret;
    const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);
    let success_count = 0;

    if (req.body.id == "export") {
        const data = [];
        const all_vars = [];
        sailthru.apiGet("content", content_obj, 
            function(err, response) {
                if (err) {
                    console.log(err);
                }
                else {
                    const all_content = response.content;
                    all_content.forEach(content => {
                        if (content.vars) {
                            const content_vars = Object.keys(content.vars);
                            content_vars.forEach(content_var => {
                                if (!all_vars.includes(content_var)) {
                                    all_vars.push(content_var);
                                }
                            });
                        }
                    });
                }
            sailthru.apiGet("content", content_obj,
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
                            // content_data.title = content.title.replace(/\s\s+/g, " ");
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
                        if (content.vars) {
                            all_vars_sorted.forEach(val => {
                                if (content.vars[val]) {
                                    const content_var = content.vars[val];
                                    content_data[val] = content_var;
                                }
                                else {
                                    content_data[val] = "";
                                }
                            });
                        }
                        data.push(content_data);
                    });
                    res.send(JSON.stringify(data));
                }
            });
        });
    }
    setTimeout(function() {
        res.send(JSON.stringify({"success_count": success_count}));
    }, 5000);
});