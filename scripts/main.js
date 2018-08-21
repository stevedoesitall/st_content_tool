import { get_id, headers, cl, date, string } from "./ditko.js";

function secure() {
    if (window.location.href.substr(0,5) != "https" && window.location.href.indexOf("http://localhost:") == -1) {
        window.location.href = "https://st-content-manager.herokuapp.com/";
    }
};

window.onload = secure();

console.log(date);
const import_btn =  get_id("import");
const export_btn =  get_id("export");

export_btn.addEventListener("click",
    function download() {
    fetch("/server", {
        method: "post",
        headers: headers
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
})


//const csv is the CSV file with headers
import_btn.addEventListener("click",
    function csv_to_json() {
        // alert("Nothing yet...");
        // import_btn.disabled = true;
        // return false;
        const result = [];
        loaded_file.click();
        loaded_file.addEventListener("change", 
            function load_file() {
                const file = get_id("loaded_file").files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                    const csv = event.target.result;
                    const lines = csv.split("\n");
                    
                    const headers = lines[0].split(",");

                    let obj;
                    let current_line;
                
                    for (let i = 1; i < lines.length - 1; i++) {
                        obj = {};
                        current_line = lines[i].split(",");                  
                        for (let x = 0; x < headers.length; x++){
                            obj[headers[x]] = current_line[x];
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
                        body: string({id: "import", data: result})
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
                        })
                    })
                }, 1000);
            }
        })
    }
)