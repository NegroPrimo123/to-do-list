const { Task } = require('../models');

exports.getAllTasks = async (req, res) => {
  try {
    const { status, priority, tags, fromDate, toDate } = req.query;
    const where = { userId: req.user.id };
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (tags) where.tags = { [Sequelize.Op.contains]: tags.split(',') };
    
    if (fromDate || toDate) {
      where.dueDate = {};
      if (fromDate) where.dueDate[Sequelize.Op.gte] = new Date(fromDate);
      if (toDate) where.dueDate[Sequelize.Op.lte] = new Date(toDate);
    }
    
    const tasks = await Task.findAll({ where });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.destroy();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};