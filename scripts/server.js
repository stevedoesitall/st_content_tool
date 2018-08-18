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

const fields = ["url", "title", "tags", "date", "views"];

const api_key = process.env.api_key || creds.api_key;
const api_secret = process.env.api_secret || creds.api_secret;

const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

app.use(express.static(dir));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.listen(port, () => console.log("Content Tool started on port " + port));

//Post to the appropriate file depending on the req.body.id value
app.post("/server", function(req, res) {
    const data = [];
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
                    content_data.date = content.date.replace(/,/g, " ");
                    if (content.title) {
                        content_data.title = content.title;
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
                        content_data.views = "";
                    }
                    data.push({"url":content_data.url,"title":content_data.title, "date":content_data.date,"views":content_data.views,"tags":content_data.tags});
                });
                const csv = { data: data, fields: fields };
                res.send(JSON.stringify(data));
                // console.log(data);
                // const csv = json2csv({ data: data, fields: fields });
                // console.log(csv);
                // const file_name = date_time + ".csv";
                // // const file = file_path + file_name;
                // // fs.writeFile(file, csv, function(err) {
                // //     if (err) {
                // //         console.log(err);
                // //     }
                // //     else {
                // //         console.log("Success!");
                // //     }
                // // });
                // res.set("Content-Disposition", "inline;filename=" + file_name);
            }
        });
});