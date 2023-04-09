import { Request, Response } from "express";
import { NotesDB } from "../datastore/ddbNote";
import mockData from "../../mockData";
import { DBResult, Note } from "../types/customDataTypes";
import { AWS_HEADER_KEY, NOTE_PK_SYN } from "../types/constants";
import { DeleteItemOutput, GetItemOutput, ScanOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";

const db = new NotesDB();
export function saveNotes(request: Request, response: Response) {
   //validate the note 
   const reqBody = request.body;
   // console.log(reqBody);
   if(reqBody == null) {
        response.statusCode = 400;
        response.send("Error: a note create request must have a body");
        return;
   }
   const note = reqBody as Note;
   note.note_id = NOTE_PK_SYN + new Date().getTime();
   db.saveNote(note);
   response.statusCode = 201;
   response.send(note);
}

export async function getNotes(request: Request, response: Response) {
    if (request.headers[AWS_HEADER_KEY]) {
        db.getNotesFromAWS().then((data: ScanOutput) => {
            response.statusCode = 200;
            response.send(data.Items);
        }).catch(err => {
            console.log("GOT ERROR"+  new Date().toISOString());
            const error = `Error is -> ${JSON.stringify(err)}`;
            response.statusCode = 500;
            response.send(error);
        });
    } else {
        const notes = await db.getAllNotes();
        response.statusCode = 200;
        response.send(notes);
    }
}

export async function getNote(request: Request, response: Response) { 
    const id = request.params && request.params.id;
    if(!id) {
        response.statusCode = 400;
        response.send("No query params passed, need to pass the id");
        return;
    }
    const searchId = id;
    if (request.headers[AWS_HEADER_KEY]) {
        db.getNoteFromAWS(searchId).then((value: GetItemOutput) => {
            response.statusCode = 200;
            response.send(value.Item);
        }).catch(err => {
            response.statusCode = 500;
            response.send(err);
        })
    } else {
        const notes = await db.getAllNotes();
        const note = notes.find((elem:any) => elem.note_id == searchId);
        response.statusCode = 200;
        response.send(note);
    }
}
export function updateNote(request: Request, response: Response) {
    const queryId = request.query && request.query.id as string;
    if(!queryId) {
        response.statusCode = 400;
        response.send("Invalid request, missing NoteId");
        return;
    }
    const reqBody = request.body;
    if(!reqBody) {
        response.statusCode = 400;
        response.send("Invalid update body passed");
        return;
    }
    if (request.headers[AWS_HEADER_KEY]) {
        db.updateNoteOnAWS(queryId, reqBody).then((data: UpdateItemOutput) => {
            response.statusCode = 204;
            response.send("");
        }).catch(err => {
            response.statusCode = 500;
            response.send(`Problem updating data -> ${err}`);
        })
    } else {
        const updatedNote = db.updateNote(queryId, reqBody);
        response.statusCode = 200;
        response.send(updatedNote);
    }
}

export async function deleteNote(request: Request, response: Response) {
    const noteId = request.query && request.query.id;
    if(!noteId) {
        response.statusCode = 400;
        response.send("No note id param supplied");
        return;
    } 
    if(request.headers[AWS_HEADER_KEY]) {
        const queryParam = request.query.id as string;
        const note = await db.getNoteFromAWS(queryParam);
        if(!note.Item) {
            response.statusCode = 404;
            response.send("Note with id note found");
            return;
        }
        db.deleteNoteFromAWS(queryParam).then((res: DeleteItemOutput) => {
            response.statusCode = 204;
            response.send(res);
        }).catch(err => {
            const errMsg = `Delete failed because ${err}`;
            console.log(err);
            response.statusCode = 500;
            response.send(errMsg);
        })
        
    } else {
        const queryParam = request.query.id as string;
        const delProcessRes: DBResult = db.deleteNote(queryParam);
        response.statusCode = delProcessRes.code;
        response.send(delProcessRes.message);    
    }
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

export async function getNotesForUser(request: Request, response: Response) {
    const queryUserId = request.query && request.query.userId as string;
    if (!queryUserId) {
        response.statusCode = 400;
        response.send("Missing parameter user id");
        return;
    } 
    db.getNotesByUserAWS(queryUserId)
    .then((res: ScanOutput) => {
        const items = res.Items ?? {};
        const itemsStr = JSON.stringify(items);
        response.statusCode = 200;
        response.send(items);
    })
    .catch((err) => {
        const errMsg = `Failed to retrieve because ${err}`;
        response.statusCode = 500;
        response.send(errMsg);
    });
}
