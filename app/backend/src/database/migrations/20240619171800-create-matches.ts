import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      home_team_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'teams',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      home_team_goals: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      away_team_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'teams',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      away_team_goals: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      in_progress: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('matches');
  },
};
