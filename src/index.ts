import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import { bulkInsertMockData, deleteNote, getNote, getNotes, saveNotes, updateNote } from './routes/crudNotes';
import getAllUsers from './routes/getAllUsers';
const app = express();
const server = new http.Server(app);
server.listen(3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/users/all', getAllUsers);

app.post('/note/', saveNotes);
app.get('/note/all', getNotes);
app.patch('/note/', updateNote);
app.delete('/note/', deleteNote);
app.get("/note/", getNote);
app.get("/note/insertMock", bulkInsertMockData);
