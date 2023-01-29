import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { getNews } from './api/news';
import { bulkInsertMockData, deleteNote, getNote, getNotes, saveNotes, updateNote } from './routes/notesController';
import { getWeather } from './api/weather';
import { deleteTodo, getAllTodo, getTodo, getTodoForUser, saveTodo, updateTodo } from './routes/todoController';
import { deleteUser, getUser, saveUser, updateUser } from './routes/userController';


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

app.post('/todo/', saveTodo);
app.get('/todo/:id', getTodo);
app.get('/todos/', getAllTodo);
app.delete('/todo/', deleteTodo);
app.patch('/todo/', updateTodo);

app.get('/todos/forUser/', getTodoForUser);

app.get('/weather', getWeather);
app.get('/news/', getNews);

app.post('/user/', saveUser);
app.get('/user/:id', getUser);
app.patch('/user/', updateUser);
app.delete('/user/', deleteUser);