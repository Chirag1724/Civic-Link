const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req,res)=>{
  try{
    const {name,email,password,role} = req.body;
    if(!name||!email||!password) return res.status(400).json({error:'Missing fields'});
    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({error:'User exists'});
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    const user = await User.create({name,email,password:hash,role});
    res.json({user:{id:user._id,name:user.name,email:user.email,role:user.role}});
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

exports.login = async (req,res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error:'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({error:'Invalid credentials'});
    const token = jwt.sign({id:user._id,role:user.role,name:user.name}, process.env.JWT_SECRET || 'dev', {expiresIn:'7d'});
    res.json({token, user:{id:user._id,name:user.name,email:user.email,role:user.role}});
  }catch(err){
    res.status(500).json({error:err.message});
  }
};
