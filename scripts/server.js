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
            const all_vars_sorted = all_vars.sort();
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
                            content_data.title = content.title.replace(/,/g, " - ").replace(/[^\x00-\x7F]/g, "").replace(/(?:\\[rn])+/g, "");
                            content_data.title = content_data.title.replace(/#/g, "-");
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
                        if (content.expire_date) {
                            content_data.expire_date = content.expire_date.replace(/,/g, " ");
                        }
                        else {
                            content_data.expire_date = "";
                        }
                        if (content.location) {
                            content_data.location = JSON.stringify(content.location).replace(/,/g, "|");
                        }
                        else {
                            content_data.location = "";
                        }
                        if (content.author) {
                            content_data.author = JSON.stringify(content.author).replace(/,/g, "-");
                        }
                        else {
                            content_data.author = "";
                        }
                        if (content.price) {
                            content_data.price = content.price;
                        }
                        else {
                            content_data.price = 0;
                        }
                        if (content.sku) {
                            content_data.sku = content.sku;
                        }
                        else {
                            content_data.sku = "";
                        }
                        if (content.inventory) {
                            content_data.inventory = content.inventory;
                        }
                        else {
                            content_data.inventory = 0;
                        }
                        if (content.site_name) {
                            content_data.site_name = JSON.stringify(content.site_name).replace(/,/g, "-");
                        }
                        else {
                            content_data.site_name = "";
                        }
                        if (content.images) {
                            if (content.images.full) {
                                content_data.image_full = content.images.full.url;
                            }
                            else {
                                content_data.image_full = "";
                            }
                            if (content.images.thumb) {
                                content_data.image_thumb = content.images.thumb.url;
                            }
                            else {
                                content_data.image_thumb = "";
                            }
                        }
                        else {
                            content_data.image_full = "";
                            content_data.image_thumb = "";
                        }
                        if (content.description) {
                            content_data.description = content.description.replace(/,/g, " - ").replace(/\n/g, "").replace(/[^\x00-\x7F]/g, "").replace(/\r/g, "");
                        }
                        else {
                            content_data.description = "";
                        }
                        if (content.vars) {
                            all_vars_sorted.forEach(val => {
                                if (content.vars[val]) {
                                    let content_var = content.vars[val];
                                    if (typeof content_var == "object") {
                                        content_var = JSON.stringify(content_var).replace(/,/g, "|");
                                    }
                                    else if (typeof content_var == "string") {
                                        content_var = content_var.replace(/,/g, " - ");
                                        content_var = content_var.replace(/\n/g, "");
                                    }
                                    content_data[val] = content_var;
                                }
                                else {
                                    content_data[val] = "";
                                }
                            });
                        }
                        else {
                            all_vars_sorted.forEach(val => {
                                content_data[val] = "";
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