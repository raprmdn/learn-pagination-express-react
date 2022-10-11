const UserService = require('../services/user.service');

module.exports = {
    index: async (req, res) => {
        try {
            const serviceResponse = await UserService.index(req);
            return res.status(serviceResponse.code).json(serviceResponse);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
}