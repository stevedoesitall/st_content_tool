//Create app using express.js
const port = process.env.PORT || 3000;
const express = require("express");
const body_parser = require("body-parser");
const path = require("path");
const file_path = "./public/csv/file";
const creds = require("./creds.json");
const http = require("http");
const app = express();
const server = http.createServer(app);
const dir = path.join(__dirname, "../");

const json2csv = require("json2csv");
const fs = require("fs");
const mime = require("mime");
const fields = ["url", "title", "tags", "date", "views"];
const data = [];

const today = new Date();
const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const date_time = date + " " + time;

const api_key = process.env.api_key || creds.api_key;
const api_secret = process.env.api_secret || creds.api_secret;

const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

app.use(express.static(dir));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.listen(port, () => console.log("Content Tool started on port " + port));

//Post to the appropriate file depending on the req.body.id value
app.post("/server", function(req, res) {
    sailthru.apiGet("content", {
        items: 10
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
                    content_data.date = content.date;
                    if (content.title) {
                        content_data.title = content.title;
                    }
                    else {
                        content_data.title = "";
                    }
                    if (content.tags) {
                        content_data.tags = content.tags.toString();
                    }
                    else {
                        content_data.tags = "";
                    }
                    if (content.views) {
                        content_data.views = content.views;
                    }
                    else {
                        content_data.views = "";
                    }
                    data.push({"url":content_data.url,"title":content_data.title, "date":content_data.date,"views":content_data.views,"tags":content_data.tags});
                });
                console.log(data);
                const csv = json2csv({ data: data, fields: fields });
                console.log(csv);
                // const file_name = date_time + ".csv";
                // const file = file_path + file_name;
                // fs.writeFile(file, csv, function(err) {
                //     if (err) {
                //         console.log(err);
                //     }
                //     else {
                //         console.log("Success!");
                //     }
                // });
                // const file_location = path.join('/',file);
                // res.download(file);
            }
        });
});