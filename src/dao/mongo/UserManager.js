import { usersModels } from "../models/users.model.js";
class UsersManager {
    async findById(id) {
        const response = await usersModels.findById(id);
        return response;
    }
    async findByEmail(email) {
        const response = await usersModels.findOne({ email });
        return response;
    }

    async createOne(obj) {
        const response = await usersModels.create(obj);
        return response;
    }
}

export const usersManager = new UsersManager();
