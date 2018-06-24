const router = require("express").Router(),
    controller = require("../../controllers/view.js");

router.get('/', controller.sendIndex);
router.get('/*', controller.fourohfour);

module.exports = router;