module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define(
    'Attachment',
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
  Attachment.associate = (db) => {
    db.Attachment.belongsTo(db.PostCategory);
    db.Attachment.belongsTo(db.Post);
    // db.Attachment.belongsTo(db.Member);
  };
  return Attachment;
};
