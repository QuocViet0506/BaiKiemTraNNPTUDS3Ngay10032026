const express = require('express');
const router = express.Router();
const Role = require('../schemas/role');
const User = require('../schemas/user');

// create role
router.post('/', async (req, res) => {
  try {
    const role = await Role.create(req.body);
    return res.status(201).json(role);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    return res.json(roles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get role by id
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) return res.status(404).json({ error: 'Role not found' });
    return res.json(role);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// update role
router.put('/:id', async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!role) return res.status(404).json({ error: 'Role not found' });
    return res.json(role);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// soft delete role
router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!role) return res.status(404).json({ error: 'Role not found' });
    return res.json({ message: 'Role soft deleted', role });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// get all users by role id
router.get('/:id/users', async (req, res) => {
  try {
    const roleId = req.params.id;
    const role = await Role.findOne({ _id: roleId, isDeleted: false });
    if (!role) return res.status(404).json({ error: 'Role not found' });

    const users = await User.find({ role: roleId, isDeleted: false }).populate('role');
    return res.json(users);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
