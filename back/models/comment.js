module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      timestamps: true,
      paranoid: true,
    }
  );
  Comment.associate = (db) => {
    // db.Comment.belongsTo(db.Member);
    db.Comment.belongsTo(db.Post);
  };
  return Comment;
};
