'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    UserId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    TagIds: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    HaterIds: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    CommentIds: {
        type: DataTypes.STRING,
        defaultValue: ''
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          Post.belongsTo(models.User);
          Post.hasMany(models.Comment);
          Post.hasMany(models.Tag);
      }
    }
  });
  return Post;
};