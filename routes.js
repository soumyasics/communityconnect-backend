const express = require("express");
const router = express.Router();
router.post("/",(req,res)=>{
    res.send("testing")
})
module.exports = router;
