// create a user;
const User = require("../models/user-model");

const createUser = async (req,res)=>{
    const {name,email,password,role} = req.body;
    if(!name || !email || !password || !role){ 
        return res.status(400).json({message:"Please provide all the required fields"});
    }
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User with this email already exists"});
        }
        const user = new User({name,email,password,role});
        await user.save();
        res.status(201).json({message:"User created successfully",user});
    } catch (error) {
        console.error("Error creating user", error);
        res.status(500).json({message:"Internal server error"});
    }   
}

// update a user patch request
const updateUser = async (req,res)=>{
    const {id} = req.params;
    const {name,email,password,role} = req.body;
    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        user.role = role || user.role;  
        await user.save();
        res.status(200).json({message:"User updated successfully",user});
    } catch (error) {
        console.error("Error updating user", error);
        res.status(500).json({message:"Internal server error"});
    }
}

// delete user
const deleteUser = async (req,res)=>{
    const {id} = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User deleted successfully"});
    } catch (error) {
        console.error("Error deleting user", error);
        res.status(500).json({message:"Internal server error"});
    }
}

// get user details
const getUserDetails = async (req,res)=>{
    try {
        const users = await User.find();
        res.status(200).json({message:"Users fetched successfully",users});
    } catch (error) {
        console.error("Error fetching users", error);
        res.status(500).json({message:"Internal server error"});
    }
}

// get a user by id
const getUserById = async (req,res)=>{
    const {id} = req.params;
    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User fetched successfully",user});
    } catch (error) {
        console.error("Error fetching user", error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports = {createUser,updateUser,deleteUser,getUserDetails,getUserById};