const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: 'https://i.sstatic.net/l60Hf.png'
  },
  status: {
    type: Boolean,
    default: false
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: 'Role'
  },
  loginCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
