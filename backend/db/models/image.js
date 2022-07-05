'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsTo(models.Review, { foreignKey: 'reviewId', onDelete: 'CASCADE' });
      Image.belongsTo(models.Spot, { foreignKey: 'spotId', onDelete: 'CASCADE' });
      Image.belongsTo(models.Spot, { foreignKey: 'previewImgId', onDelete: 'CASCADE' });
    }
  }
  Image.init({
    spotId: {
      type: DataTypes.INTEGER,
    },
    reviewId: {
      type: DataTypes.INTEGER,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
