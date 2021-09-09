module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      userPwd: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      userName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      userStatus: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: '1',
      },
      thought: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'Write your own quotes!',
      },
      profileImg: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
      },
      profileImgTitle: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
  Member.associate = (db) => {
    db.Member.hasMany(db.PostCategory);
    db.Member.hasMany(db.Post);
  };
  return Member;
};
