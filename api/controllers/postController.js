const User = require('../models/user');
const Post = require('../models/post');

const createPost = async (req, res) => {
    // Create a single post
    try {
        const { text } = req.body;
        let { img } = req.body || "";
        // if (!postedBy) return res.status(400).json({ error: "No user"});
        if (!text) return res.status(404).json({ error: "Empty text field"});

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized post entry" });
        };
        if (text.length > 500) {
            return res.status(400).json({ error: "Text must be less than 500 characters" });
        };
        // For img saving

        const newPost = new Post({ postedBy: req.user._id, text, img });
        await newPost.save();
        res.status(201).json(newPost)
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const feed = async (req, res) => {
    // Get a feed of all the latest posts
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const getPost = async (req, res) => {
    // Get a specific post
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({username});
        if (!user) return res.status(404).json({ error: "User does not exist." });
        // console.log(user);
        const { _id } = user;
        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts)   
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const updatePost = async (req, res) => {
    // Update post, still need to validate though
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found"})
        const { text } = req.body;
        post.text = text;
        await post.save();
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found"})
        
        await Post.findByIdAndDelete(id);
        res.status(200).json({ Successful: `Post ${id} deleted successfully`})
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};



module.exports = { createPost, feed, getPost, getUserPosts, updatePost, deletePost }