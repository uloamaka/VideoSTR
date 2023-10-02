const router = require("express").Router();

const mediaRouter = require("./disk.route");

router.use("/", mediaRouter);
module.exports = router;
