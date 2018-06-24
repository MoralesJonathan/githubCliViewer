const router = require("express").Router(),
    controller = require("../../controllers");

router.get('/', controller.sendIndex);
router.get('/*', controller.fourohfour);

module.exports = router;