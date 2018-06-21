const router = require("express").Router()
const controller = require("../../controllers");

router.post('/uploadUrl', controller.upload);

module.exports = router;

