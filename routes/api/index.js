const router = require("express").Router()
const controller = require("../../controllers");

router.post('/uploadUrl', controller.upload);
router.post('/startNode', controller.runNode);
router.post('/sendInput/:text', controller.sendInput);

module.exports = router;

