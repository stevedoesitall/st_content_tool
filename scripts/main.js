import { get_id, headers, cl, create_el, date, string } from "https://rawgit.com/stevedoesitall/ditkojs/master/ditko.js";

//Force the site to load in HTTPS
function secure() {
    if (window.location.href.substr(0,5) != "https" && window.location.href.indexOf("http://localhost:") == -1) {
        window.location.href = "https://st-content-manager.herokuapp.com/";
    }
};

window.onload = secure();

const export_btn = get_id("export");
const notes_btn = get_id("notes");
const notes_section = get_id("notes_list");

notes_btn.addEventListener("click", 
    function show_notes() {
        if (notes_section.classList.contains("hidden")) {
            notes_section.classList.remove("hidden");
            notes_btn.innerHTML = "Hide";
        }
        else {
            notes_section.setAttribute("class", "hidden");
            notes_btn.innerHTML = "Notes";
        }
    }
);

export_btn.addEventListener("click",
    function download() {
        const id = "export";
        const creds = {};
            const api_key = get_id("api_key");
            const api_secret = get_id("api_secret");

            creds.api_key = api_key.value;
            creds.api_secret = api_secret.value;
            if (!creds.api_key) {
                alert("Please enter an API key value.");
                api_key.setAttribute("class", "error");
                return false;
            }
            if (!creds.api_secret) {
                alert("Please enter an API secret value.");
                api_secret.setAttribute("class", "error");
                return false;
            }
    fetch("/server", {
        method: "post",
        headers: headers,
        body: string({id: id, creds: creds})
    })
    .then(
    function(response) {
    if (response.status != 200) {
        cl("Error: " + response.status);
        return;
    }
    response.json().then(
        function json_to_csv(resp_data) {
            if (resp_data.statusCode == 401) {
                alert("Invalid API credentials.");
                return false;
            }
            const column_delimiter = ",";
            const line_delimiter = "\n";
            const keys = Object.keys(resp_data[0]);

            let result = "";

            result += keys.join(column_delimiter);
            result += line_delimiter;

            resp_data.forEach(function(item) {
                let x = 0;
                keys.forEach(function(key) {
                    if (x > 0) result += column_delimiter;
                    result += item[key];
                    x++;
                });
                result += line_delimiter;
            });
            cl(result);
            const csv = 'data:text/csv;charset=utf-8,' + result;
            const file = encodeURI(csv);
            const file_name = "Content Export " + date + ".csv";
            const hidden_dl = get_id('export_url');
                hidden_dl.setAttribute("href", file);
                hidden_dl.setAttribute("download", file_name);
                hidden_dl.click();
        })
    })
    .catch(error => cl(error) );
});