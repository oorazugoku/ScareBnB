'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.addColumn('Spots', 'previewImgId', {
        type: Sequelize.INTEGER,
        references: { model: 'Images', key: 'id' }
      });


  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('Spots', 'previewImgId')

  }
};
