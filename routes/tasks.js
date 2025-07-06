const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const taskController = require('../controllers/tasks');

router.use(authMiddleware);

router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;