import bcrypt from 'bcrypt';
import User from '../models/userModal.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

    
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log("Register attempt with email:", email);
    console.log("Register attempt with password:", password);
    
    try{
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newuser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newuser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch(error){
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Debugging logs
    console.log("Login attempt with email:", email);
    console.log("Login attempt with password:", password);

    try{
        const user = await User.find({ email });
        console.log("User found:", user);
        if(user.length === 0){
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if(!isPasswordValid){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("Generated token:", token);
        res.status(200).json({ token, user });
    } 
    catch(error){
        res.status(500).json({ message: "Internal server error" });
    }
};

