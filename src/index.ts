import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { getNews } from './api/news';
import { bulkInsertMockData, deleteNote, getNote, getNotes, getNotesForUser, saveNotes, updateNote } from './routes/notesController';
import { getWeather } from './api/weather';
import { deleteTodo, getAllTodo, getTodo, getTodoForUser, saveTodo, searchTodo, updateTodo } from './routes/todoController';
import { deleteUser, getUser, getUserByEmail, getUsers, saveUser, updateUser } from './routes/userController';

import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
app.listen(PORT, () => {
    console.log(`Started listening on ${PORT}`);
});
//const server = new http.Server(app);
//server.listen(3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// can this be an interceptor?
app.use((request, response, next) => {
    if(!request.headers["x-api-key"] ||
    request.headers["x-api-key"] != process.env.API_KEY ) {
        response.status(401).send("You are not authorised to access this!");
    } else {
        next();
    }
})

app.use(cors());

app.get("/", (request: Request, response: Response) => {
    response.statusCode = 200;
    console.log("Started the server");
    response.send({"greeting": "Hello World"})
});

app.get("/ping", (request: Request, response: Response) => {
    response.statusCode = 200;
    response.send("Hello Typescript");
});


// app.get('/users/all', getAllUsers);

app.post('/note/', saveNotes);
app.get('/note/all', getNotes);
app.patch('/note/', updateNote);
app.delete('/note/', deleteNote);
app.get('/note/:id', getNote);
app.get('/note/insertMock', bulkInsertMockData);
app.get('/notes/forUser/', getNotesForUser);

app.post('/todo/', saveTodo);
app.get('/todo/:id', getTodo);
app.get('/todos/', getAllTodo);
app.delete('/todo/', deleteTodo);
app.patch('/todo/', updateTodo);
app.post('/todo/search', searchTodo);

app.get('/todos/forUser/', getTodoForUser);


app.get('/weather', getWeather);
app.get('/news/', getNews);

app.post('/user/', saveUser);
// app.get('/users/', getUsers);
app.get('/user/:id', getUser);
app.get('/user/by/email/:email', getUserByEmail);
app.patch('/user/', updateUser);
app.delete('/user/', deleteUser);
