const router = require("express").Router(),
    controller = require("../../controllers");

router.post('/uploadUrl', controller.upload);
router.post('/startNode', controller.runNode);
router.post('/sendInput/:text', controller.sendInput);
router.post('/newRoom', controller.generateRoom);

module.exports = router;

