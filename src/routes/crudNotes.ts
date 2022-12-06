import { Request, Response } from "express";
import { DB, DBResult } from "../db";
import mockData from "../../mockData";

export interface Note {
    date: Date;
    text: string;
    user: {};
    id: number | null;
}
const db = new DB();
export function saveNotes(request: Request, response: Response) {
   //validate the note 
   const reqBody = request.body;
   // console.log(reqBody);
   if(reqBody == null) {
        response.statusCode = 400;
        response.send("Error: a note create request must have a body");
   }
   const note = reqBody as Note;
   db.saveNote(note);
   response.statusCode = 201;
   response.send(note);
}

export function getNotes(request: Request, response: Response) {
    const notes = db.getAllNotes();
    response.statusCode = 200;
    response.send(notes);
}

export function getNote(request: Request, response: Response) { 
    const queryParams = request.query;
    
    if(queryParams == null) {
        response.statusCode = 400;
        response.send("No query params passed, need to pass the id");
    }
    //const searchId = queryParams.id as number;
    //const notes = db.getAllNotes();
    //const note = notes.find(elem => elem.id == searchId);
}
export function updateNote(request: Request, response: Response) {
    const queryId = Number(request.query.id);
    const reqBody = request.body;
    const reqBodyNote = reqBody as Note;
    if(queryId) {
        const updatedNote = db.updateNote(queryId, reqBodyNote);
        response.statusCode = 200;
        response.send(updatedNote);
    } else {
        response.statusCode = 400;
        response.send("Note with ID passed in doesn't exist");
    }
}

export function deleteNote(request: Request, response: Response) {
    if(request.query == undefined) {
        response.statusCode = 400;
        response.send("No note id param supplied");
        return;
    }
    const queryParam = request.query.id;
    const noteId = Number(queryParam);
    const delProcessRes: DBResult = db.deleteNote(noteId);
    response.statusCode = delProcessRes.code;
    response.send(delProcessRes.message);    
}

export function bulkInsertMockData(request: Request, response: Response) {
    try {
        mockData.forEach(note => {
            db.saveNote(note);
        });
        response.statusCode = 200;
        response.send("Mock data inserted");
    } catch(e) {
        response.statusCode = 500;
        response.send(`Internal server error while trying to insert data \n ${JSON.stringify(e)}`);
    }
}