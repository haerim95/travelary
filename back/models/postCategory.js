module.exports = (sequelize, DataTypes) => {
  const PostCategory = sequelize.define(
    'PostCategory',
    {
      categoryName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      // categoryCode: {
      //   type: DataTypes.STRING(45),
      //   allowNull: false,
      // },
      // travelStart: {
      //   type: DataTypes.TIMESTAMP,
      //   allowNull: false,
      // },
      // travelEnd: {
      //   type: DataTypes.TIMESTAMP,
      //   allowNull: false,
      // },
      thumbnail: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      categoryTrue: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      modelName: 'PostCategory',
      tableName: 'postCategories',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      timestamps: true,
      paranoid: true,
      sequelize,
    }
  );
  PostCategory.associate = (db) => {
    db.PostCategory.hasMany(db.Attachment);
    db.PostCategory.belongsTo(db.Member);
    db.PostCategory.hasMany(db.Post);
  };
  return PostCategory;
};
