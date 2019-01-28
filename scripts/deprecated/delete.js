if (req.body.id == "delete") {
    let success_count = 0;
    const all_content = req.body.data;
    all_content.forEach(content => {
        sailthru.apiDelete("content", {
            url: content.url
        },
        function(err, response) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(response);
                success_count = success_count + 1;
            }
        });
    });
    res.send(JSON.stringify({"success_count": 6}));
}