'use strict';
module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define('Tag', {
    name: DataTypes.STRING,
    PostIds: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          Tag.belongsToMany(models.Post, {through: 'Posts_Tags', foreignKey: 'tag_id', otherKey: 'post_id'});
          Tag.belongsToMany(models.Comment, {through: 'Posts_Tags', foreignKey: 'tag_id', otherKey: 'post_id'});
      }
    }
  });
  return Tag;
};