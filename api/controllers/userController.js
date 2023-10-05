const User = require('../models/user');
const bcrypt = require('bcryptjs')

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
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
        })
        await newUser.save();
        const token = newUser.createJWT();

        res.status(201).json({User: newUser, Token: token});

        console.log(newUser.username);
        console.log(newUser.password)
        console.log(token);
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
            bio: user.bio,
            profilePicture: user.profilePicture,
         })
    } catch (err) {
        res.status(500).json({Err: err.message});
        console.log("Error in Loggin in:", err.message);
    }
};

module.exports = { registerUser, loginUser }