const mongoose = require('mongoose');

const wallSchema = new mongoose.Schema(
    {
        participants:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        lastMessage: {
            text: String,
            sender: { 
                type: mongoose.Schema.Types.ObjectId, ref: "User" 
            },
            seen: {
                type: Boolean,
                default: false,
            },
        },
    }, { timestamps: true }
);

const wall = mongoose.model('Wall', wallSchema);
module.exports = wall;