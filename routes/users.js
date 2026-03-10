const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

// create user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// get all users, query username includes
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;
    const filter = { isDeleted: false };
    if (username) {
      filter.username = { $regex: username, $options: 'i' };
    }
    const users = await User.find(filter).populate('role');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// soft delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ message: 'User soft deleted', user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// enable by email+username
router.post('/enable', async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) return res.status(400).json({ error: 'email and username are required' });

    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// disable by email+username
router.post('/disable', async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) return res.status(400).json({ error: 'email and username are required' });

    const user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
