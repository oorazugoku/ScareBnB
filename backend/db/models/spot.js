'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', onDelete: 'CASCADE', as: 'Owner' });
      Spot.belongsTo(models.Image, { foreignKey: 'previewImgId', onDelete: 'CASCADE', as: 'PreviewIMG' });

      Spot.hasMany(models.Booking, { foreignKey: 'spotId', hooks: true});
      Spot.hasMany(models.Review, { foreignKey: 'spotId', hooks: true});
      Spot.hasMany(models.Image, { foreignKey: 'spotId', hooks: true, as: 'Images'});
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL
    },
    lng: {
      type: DataTypes.DECIMAL
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, Infinity]
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    previewImgId: {
      type: DataTypes.INTEGER
    },
    numReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    avgStarRating: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
