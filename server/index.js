import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import productRoutes from './routes/product-routes.js';
import orderRoutes from './routes/order-routes.js';
import authRoutes from './routes/auth-routes.js';
import userRoutes from './routes/user-routes.js';
import chatRoutes from './routes/chat-routes.js';
import roomRoutes from './routes/room-routes.js';
import orderDetailRoutes from './routes/order-detail-routes.js';
import commentRoutes from './routes/comment-routes.js';
import promotionRoutes from './routes/promotion-code-routes.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import * as io from 'socket.io';

const app = express();
const server = http.createServer(app);
const socketio = new io.Server(server);
socketio.on('connection', socket => {
    socket.on('message', (message) => {
        socketio.emit('message', message)
    })
})

dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));
//app.use(cors({ origin: 'https://e-com-mern-project.netlify.app' }));
app.use(morgan('dev'));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/messages', chatRoutes);
app.use('/rooms', roomRoutes);
app.use('/orderdetails', orderDetailRoutes);
app.use('/comments', commentRoutes);
app.use('/promotions', promotionRoutes);

const CONNECTION_URL = "mongodb://localhost:27017/e-commerce-website"
//const CONNECTION_URL = "mongodb+srv://7r4nquocbao:7r4nquocbao@cluster0.e8vei.mongodb.net/<dbname>?retryWrites=true&w=majority"
const PORT = process.env.PORT || 4000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => server.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));
    
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
