const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Task = db.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  dueDate: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
});

Task.associate = (models) => {
  Task.belongsTo(models.User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
};

module.exports = Task;