import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { getNews } from './api/news';
// import { getNews } from './api/news';
import { bulkInsertMockData, deleteNote, getNote, getNotes, saveNotes, updateNote } from './routes/crudNotes';
import getAllUsers from './routes/getAllUsers';


dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.listen(PORT);
//const server = new http.Server(app);
//server.listen(3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (request: Request, response: Response) => {
    response.statusCode = 200;
    response.send({"greeting": "Hello World"})
});

app.get("/ping", (request: Request, response: Response) => {
    response.statusCode = 200;
    response.send("Hello Typescript");
});


app.get('/users/all', getAllUsers);

app.post('/note/', saveNotes);
app.get('/note/all', getNotes);
app.patch('/note/', updateNote);
app.delete('/note/', deleteNote);
app.get("/note/:id", getNote);
app.get("/note/insertMock", bulkInsertMockData);

app.get("/news/", getNews);
