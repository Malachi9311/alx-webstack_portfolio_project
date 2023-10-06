const User = require('../models/user');
const bcrypt = require('bcryptjs')

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password, profilePicture, bio } = req.body;
        const user = await User.findOne({ email: email, username: username });
        if (user) {
            res.status(400).json({ error: "User already exists" });
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPWD = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPWD,
            profilePicture,
            bio,          
        })
        await newUser.save();
        // const token = newUser.createJWT();

        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({Error: err.message});
        console.log("Error in Registration:", err.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({Err: "Invalid username"});
        };

        const isCorrectUser = await bcrypt.compare(password, user?.password || "")
        console.log(isCorrectUser);
        if ( !isCorrectUser ) {
            return res.status(400).json({Err: "Invalid password"});
        };

        const token = await user.createJWT();
        res.cookie("jwt", token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
         });

        res.status(200).json({ 
            userId: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
         })
    } catch (err) {
        res.status(500).json({Err: err.message});
        console.log("Error in Logging in:", err.message);
    }
};

const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1});
        res.status(200).json({ message: "You are now logged out!" });
    } catch (err) {
        res.status(500).json({Err: err.message});
        console.log("Error in Logging  out:", err.message);
    }
};


module.exports = { registerUser, loginUser, logoutUser }