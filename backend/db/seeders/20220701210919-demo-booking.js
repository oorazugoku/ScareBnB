'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bookings', [
      {
        userId: '1',
        spotId: '2',
        startDate: '1999-01-01',
        endDate: '2022-04-21'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete('Bookings', {
      userId: '1',
      spotId: '2'
    });

  }
};
