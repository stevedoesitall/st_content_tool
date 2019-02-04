const creds = require("../../scripts/creds.json");
const api_key = process.env.api_key || creds.api_key;
const api_secret = process.env.api_secret || creds.api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

const content_obj = {};
content_obj.items = 1000;

const all_vars = [];
const data = [];

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
        // console.log(all_vars_sorted);
        sailthru.apiGet("content", content_obj, 
            function(err, response) {
                if (err) {
                    console.log(err);
                }
                else {
                    const all_content = response.content;
                    all_content.forEach(content => {
                        const content_data = {};
                        if (content.vars) {
                            all_vars_sorted.forEach(val => {
                                if (content.vars[val]) {
                                    const content_var = content.vars[val];
                                    content_data[val] = content_var;
                                }
                                else {
                                    content_data[val] = "";
                                }
                                data.push(content_data);
                            });
                        }
                    });
                }
                console.log(data);
            }
        );
    }
);