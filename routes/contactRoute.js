const express = require("express");
const { Contact } = require("../controllers/ContactCon");


const router = express.Router();

//register
router.route("/contactus").post(Contact);



module.exports = router;
