if (req.body.id == "import") {
    const all_content = req.body.data;
    all_content.forEach(content => {
        if (content.tags) {
        content.tags = content.tags.split(",");
            console.log(content.tags);
            content.tags.forEach(tag => {
                if (tag.indexOf("|") != -1) {
                    tag = tag.replace(/\|/g, ",");
                    tag = tag.replace(" ", "");
                    console.log(tag);
                    content.tags = tag.split(",");
                }
            })
        }

        if (content.inventory) {
            content.inventory = parseInt(content.inventory);
            if (content.inventory == NaN) {
                delete content.inventory;
            }
        }

        else {
            delete content.inventory;
        }

        if (content.location) {
            content.location = content.location.split(",");
                content.location.forEach(location => {
                    if (location.indexOf("|") != -1) {
                        location = location.replace(/\|/g, ",");
                        location = location.replace(" ", "");
                        content.location = location.split(",");
                        if (content.location.length > 2) {
                            delete content.location;
                        }
                    }
                    else {
                        delete content.location;
                    }
                })
            }

        else {
            delete content.location;
        }

        if (content.price) {
            content.price = parseInt(content.price);
        }

        if (content.thumb || content.full) {
            content.images = {};
            if (content.full) {
                content.images.full = {};
                    content.images.full.url = content.full;
                    delete content.full;
            }
            if (content.thumb) {
                content.images.thumb = {};
                    content.images.thumb.url = content.thumb;
                    delete content.thumb;
            }
        }

        sailthru.apiPost("content", 
            content,
        function(err, response) {
            if (err) {
                console.log(err);
            }
            else {
                success_count = success_count + 1;
                console.log(response);
            }
        });
    });
}
else if (req.body.id == "delete") {
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