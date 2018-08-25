import { get_id, headers, cl, date, string } from "https://rawgit.com/stevedoesitall/ditkojs/master/ditko.js";

//Force the site to load in HTTPS
function secure() {
    if (window.location.href.substr(0,5) != "https" && window.location.href.indexOf("http://localhost:") == -1) {
        window.location.href = "https://st-content-manager.herokuapp.com/";
    }
};

window.onload = secure();

const export_btn = get_id("export");
const id = "export";
export_btn.addEventListener("click",
    function download() {
    fetch("/server", {
        method: "post",
        headers: headers,
        body: string({id: id})
    })
    .then(
    function(response) {
    if (response.status != 200) {
        cl("Error: " + response.status);
        return;
    }
    response.json().then(
        function json_to_csv(resp_data) {
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


//const csv is the CSV file with headers
document.addEventListener("click", function csv_to_json() {
    if (event.target.classList.contains("post")) {
        const id = event.target.id;
    // alert("Nothing yet...");
    // import_btn.disabled = true;
    // return false;
        const result = [];
        loaded_file.click();
        loaded_file.addEventListener("change", function load_file() {
        const file = get_id("loaded_file").files[0];
            if (file) {
                const reader = new FileReader();
                    reader.onload = function(event) {
                    const csv = event.target.result;
                        // cl(csv);
                    const lines = csv.split("\n");
                        const test_data = lines[1].split(",");
                        cl(`Line data: ${lines.length}, ${test_data}`);
                    const headers = lines[0].split(",");
                        // cl(headers);
                    let obj;
                    let current_line;
                
                    for (let line_num = 1; line_num <= lines.length - 1; line_num++) {
                        obj = {};
                        current_line = lines[line_num].split(",");       
                        for (let head_num = 0; head_num < headers.length; head_num++) {
                            obj[headers[head_num].replace(/(\r\n|\n|\r)/gm,"")] = current_line[head_num];
                        }
                        result.push(obj);
                    }
                    // console.log(result);
                    // return result;
                }
            reader.readAsText(file);
                setTimeout(function() {
                    console.log(result);
                    fetch("/server", {
                        method: "post",
                        headers: headers,
                        body: string({id: id, data: result})
                    })
                    .then(
                        function(response) {
                            if (response.status != 200) {
                                cl("Error: " + response.status);
                                return;
                            }
                        response.json().then(
                            function(resp_data) {
                            cl("Data", resp_data);
                        });
                    });
                    location.reload();
                }, 1000);
            }
        });
    }
});