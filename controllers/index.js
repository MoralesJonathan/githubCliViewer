const path = require("path");
module.exports = {
    upload: function (req, res) {
        res.sendStatus(200)
    },
    fourohfour: function (req, res) {
        res.send("Page Not Found").status(404)
    },
    sendIndex: function (req, res) {
        res.sendFile(path.join(__dirname, '../', 'index.html'));
    }
};