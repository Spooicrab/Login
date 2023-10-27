import { Server } from "socket.io";
import express from "express";
import handlebars from "express-handlebars";
import "./dao/config.js"
import { __dirname } from "./utils.js";
import ViewsRouter from './routes/views.router.js'
import { Chat } from "./dao/mongo/Chatmanager.js";
import ChatRouter from "./routes/Chat.router.js";
import ProductRouter from "./routes/Product.router.js";
import CartRouter from "./routes/Cart.router.js";
import { CartM } from "./dao/mongo/CartManager.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import UserRouter from "./routes/users.router.js";
import mongoStore from "connect-mongo";

const URI = "mongodb+srv://Coder:House@midatabasecoder.ehu4trq.mongodb.net/EcommerceCoder?retryWrites=true&w=majority"

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.use(session({
    secret: 'secretoo',
    cookie: { maxAge: 60 * 60 * 1000 },
    store: new mongoStore(
        {
            mongoUrl: URI,
        }
    )
}))


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/api/products', ProductRouter)
app.use('/views', ViewsRouter)
app.use('/chat', ChatRouter)
app.use('/api/carts', CartRouter)
app.use('/api/users', UserRouter)

const Port8080 = app.listen(8080, () => {
    console.log("ando en el puerto 8080")
})

const Sserver = new Server(Port8080)

Sserver.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("Mensaje", async (obj) => {
        const Mensajes = await Chat.Add(obj)
        const Chats = await Chat.GetAll({})
        socket.emit("OK", Chats)
    })
    socket.on('CrearCarrito', async (data) => {
        const productId = data
        const IdCarritoCreado = await CartM.CrearCarrito();
        socket.emit('creado', { productId, IdCarritoCreado });
    });

    socket.on('Agregar', async (data) => {
        const producto = data.productId;
        const IdCarritoActual = data.IdCarritoActual;
        try {
            const agregar = await CartM.AgregarCantidad(IdCarritoActual, producto);
            socket.emit('Agregado');
        } catch (error) { throw error; }
    });
});
