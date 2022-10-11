'use strict';
const { faker } = require('@faker-js/faker');

const users = [...Array(10000)].map((user) => ({
    gender: faker.name.sexType(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    created_at: new Date(),
    updated_at: new Date(),
}));

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert('users', users, {});
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    }
};
