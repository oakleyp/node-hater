'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    PostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    TagIds: DataTypes.STRING,
    HaterIds: DataTypes.STRING,
    CommentIds: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          Comment.hasMany(models.Comment);
      }
    }
  });
  return Comment;
};