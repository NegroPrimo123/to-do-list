const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ username, email, password });
    const token = generateToken(user);
    
    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};