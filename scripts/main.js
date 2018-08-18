import { get_id, headers, cl } from "./squery.js";

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
        function(resp_data) {
            cl(resp_data);
        })
    })
    .catch(error => cl(error) );
})
