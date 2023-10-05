const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        postedBy: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            maxLength: 500,
        },
        img: {
            type: String,
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        replies: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                username: {
                    type: String,
                },
                text: {
                    type: String,
                    required: true,
                },
                userProfilePicture:{
                    type: String,
                },
            }
        ]
    }, { timestamps: true }
);

const post = mongoose.model('Post', postSchema);
module.exports = post;