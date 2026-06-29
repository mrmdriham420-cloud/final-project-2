const express = require("express");
const Contact = require("./Contact");

const router = express.Router();

// Send Contact Message
router.post("/", async (req, res) => {
    try {

        await Contact.create(req.body);

        res.json({
            message: "Message Sent Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }
});

module.exports = router;