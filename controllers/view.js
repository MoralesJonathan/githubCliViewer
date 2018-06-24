const path = require("path")

module.exports = {
    fourohfour: (req, res) => {
        res.send("Page Not Found").status(404);
    },
    sendIndex: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/', 'index.html'));
    }
};
