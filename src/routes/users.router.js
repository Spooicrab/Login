import { Router } from "express";
import { usersManager } from "../dao/mongo/UserManager.js";
const UserRouter = Router();

UserRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userDB = await usersManager.findByEmail(email);
    if (!userDB) { return res.json({ error: "Verifique los datos ingresados" }) }
    req.session["email"] = email;
    req.session["first_name"] = userDB.first_name;
    if (email === "adminCoder@coder.com" && password === "Cod3r123") {
        req.session["isAdmin"] = true;
    }
    res.redirect("/profile");
});

UserRouter.post("/signup", async (req, res) => {
    const createdUser = await usersManager.createOne(req.body);
    res.status(200).json({ message: "User created", createdUser });
});
export default UserRouter;
