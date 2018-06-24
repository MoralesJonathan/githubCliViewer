const router = require("express").Router(),
    apiRoutes = require("./api"),
    viewRoutes = require("./view");

router.use('/api', apiRoutes);
router.use('/', viewRoutes);

module.exports = router;
