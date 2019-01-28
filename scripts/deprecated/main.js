//Code to run import/delete for CSV files
document.addEventListener("click", function csv_to_json() {
    const creds = {};
        creds.api_key = get_id("api_key").value;
        creds.api_secret = get_id("api_secret").value;
    if (event.target.classList.contains("post")) {
        const id = event.target.id;
        const result = [];
        loaded_file.click();
        loaded_file.addEventListener("change", function load_file() {
        const file = get_id("loaded_file").files[0];
        const file_name = get_id("loaded_file").files[0].name;
        const ext = ".csv";
        const file_ext = file_name.substr(file_name.length - ext.length);
        if (file_ext != ext) {
            const p = create_el("p");
            p.innerHTML = "File must be a valid CSV."
            const warning_section = get_id("warning_section");
            warning_section.appendChild(p);
            return false;
        }
            if (file) {
                const reader = new FileReader();
                    reader.onload = function(event) {
                    const csv = event.target.result;
                    const lines = csv.split("\n");
                        const test_data = lines[1].split(",");
                        cl(`Line data: ${lines.length}, ${test_data}`);
                    const headers = lines[0].split(",");
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
                }
            reader.readAsText(file);
                setTimeout(function() {
                    console.log(result);
                    fetch("/server", {
                        method: "post",
                        headers: headers,
                        body: string({id: id, data: result, creds: creds})
                    })
                    .then(
                        function(response) {
                            if (response.status != 200) {
                                cl("Error: " + response.status);
                                return;
                            }
                        response.json().then(
                            function(resp_data) {
                                if (resp_data.statusCode == 401) {
                                    alert("Invalid API credentials.");
                                    return false;
                                }
                                cl(resp_data);
                            // if (id == "delete") {
                            //     alert(`${resp_data.success_count} items deleted.`);
                            // }
                            // else if (id == "import") {
                            //     alert(`${resp_data.success_count} items imported.`);
                            // }
                        });
                    });
                    location.reload();
                }, 2000);
            }
        });
    }
});