//Create app using express.js
const port = process.env.PORT || 3000;
const express = require("express");
const body_parser = require("body-parser");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app);
const dir = path.join(__dirname, "../");

// const creds = require("./creds.json");
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
    let success_count = 0;

    if (req.body.id == "export") {
        const data = [];
        const all_content_vars = [];

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

                // all_content.forEach(content => {
                //     if (content.vars) {
                //         const content_vars = keys(content.vars);
                //         content_vars.forEach(content_var => {
                //             if (!all_content_vars.includes(content_var)) {
                //                 all_content_vars.push(content_var);
                //             }
                //         });
                //     }
                // });

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
                    const data_obj = {
                        "url": content_data.url,
                        "title": content_data.title, 
                        "date": content_data.date,
                        "views": content_data.views,
                        "tags": content_data.tags
                    };

                    data.push(data_obj);
                });
                res.send(JSON.stringify(data));
            }
        });
    }
    setTimeout(function() {
        res.send(JSON.stringify({"success_count": success_count}));
    }, 5000);
});