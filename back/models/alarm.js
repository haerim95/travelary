module.exports = (sequelize, DataTypes) => {
  const Alarm = sequelize.define(
    'Alarm',
    {
      // alarmConfirmDate: {
      //   type: DataTypes.DATETIME,
      //   allowNull: false,
      // },
      alarmConfirm: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      alarmCode: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
  Alarm.associate = (db) => {
    // db.Alarm.belongsTo(db.Member);
    db.Alarm.belongsTo(db.Post);
  };
  return Alarm;
};
