const { User } = require('../models');
const { StatusCodes: status } = require('http-status-codes');
const {apiResponse} = require("../utils/apiResponse.utils");
const { Op } = require("sequelize");

module.exports = {
    index: async (req) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const offset = (page - 1) * limit;
            const totalRows = await User.count({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { email: { [Op.like]: `%${search}%` } },
                    ]
                }
            });
            const totalPages = Math.ceil(totalRows / limit);
            const users = await User.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { email: { [Op.like]: `%${search}%` } },
                    ]
                },
                limit: limit,
                offset: offset,
                order: [
                    ['id', 'DESC']
                ]
            });

            return apiResponse(status.OK, 'OK', 'Users retrieved successfully.',
                { users },
                { page, limit, totalRows, totalPages }
            );
        } catch (e) {
            throw apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message);
        }
    }
}