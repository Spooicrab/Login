import { Router } from "express";
const CookieRouter = Router()

CookieRouter.post("/views/login", async (req, res) => {
    const { name, email } = req.body
    res.cookie(name, email, { maxAge: 10000 }).send('agregada')
})

export default CookieRouter;
