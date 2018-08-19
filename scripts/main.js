import { get_id, qsa, headers, cl, string } from "./squery.js";

const export_btn = get_id("export");
const import_btn = get_id("import");
const loaded_file = get_id("loaded_file");

const today = new Date();
const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

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
                let ctr = 0;
                keys.forEach(function(key) {
                    if (ctr > 0) result += column_delimiter;
                    result += item[key];
                    ctr++;
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
        }
    )
    })
    .catch(error => cl(error) );
})

//const csv is the CSV file with headers
// import_btn.addEventListener("click",
//     function csv_to_json() {
//         const result = [];

//         loaded_file.click();
//         loaded_file.addEventListener("change", 
//             function load_file() {
//                 const file = get_id("loaded_file").files[0];
//                 const reader = new FileReader();
//                 reader.onload = function(event) {
//                     const csv = event.target.result;
//                     const lines = csv.split("\n");
                    
//                     const headers = lines[0].split(",");

//                     let obj;
//                     let current_line;
                  
//                     for(let i = 1; i < lines.length; i++) {
                  
//                         obj = {};
//                         current_line = lines[i].split(",");
//                         cl(current_line)
                  
//                         for(let x = 0; x < headers.length; x++){
//                             obj[headers[x]] = current_line[x];
//                         }
                  
//                         result.push(obj);
                  
//                     }
//                     return result; //JavaScript object
//                 }

//                 reader.readAsText(file);
//             }
//         )
//         console.log(result)
//         fetch("/server", {
//             method: "post",
//             headers: headers,
//             data: {data: result}
//         })
//         .then(
//             function(response) {
//                 if (response.status != 200) {
//                     cl("Error: " + response.status);
//                     return;
//                 }
//             response.json().then(
//                 function(resp_data) {
//                 cl(resp_data);
//             })
//         })
//     }
// )
