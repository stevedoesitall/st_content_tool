import { get_id, headers, cl, current_month } from "./squery.js";

console.log(current_month);
const export_btn =  get_id("export");
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
