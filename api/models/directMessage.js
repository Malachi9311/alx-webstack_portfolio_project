const mongoose = require('mongoose');

const directMessageSchema =  new mongoose.Schema(
    {
        wallId: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Wall",
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        img: {
            type: String,
            default: "",
        },
        seen: {
            type: Boolean,
            default: false,
        },
    }, { timestamps : true }
);

const directMessage = mongoose.model("directMessage", directMessageSchema);