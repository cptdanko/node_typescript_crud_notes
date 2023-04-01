/* global localStorage, */
import { LocalStorage } from 'node-localstorage';
import AWS from 'aws-sdk';
import { AWSCallback } from '../logFuncs/networkresponse';
import { DeleteItemOutput, GetItemOutput, QueryOutput, ScanOutput, UpdateItemOutput } from 'aws-sdk/clients/dynamodb';
import { DBResult, Note } from '../types/customDataTypes';
import { NOTES_TABLE } from '../types/constants';

const NOTE_KEY = 'notes';

export class NotesDB {
    notesStore: string | null = null;

    private _lastId: number = 0;

    localStorage = new LocalStorage("./notes");
    regionParam = { region: 'ap-southeast-2' };
    ddb = new AWS.DynamoDB(this.regionParam);
    documentClient = new AWS.DynamoDB.DocumentClient(this.regionParam);

    getNotesFromAWS(): Promise<ScanOutput> {
        const params = {
            TableName: NOTES_TABLE
        };

        return this.documentClient.scan(params).promise();
    }
    getNoteFromAWS(note_id: string): Promise<GetItemOutput> {
        const params = {
            TableName: NOTES_TABLE,
            Key: {
                'note_id': note_id
            }
        };
        return this.documentClient.get(params).promise();
    }
    saveNoteToAWS(note: Note) {
        console.log('In save notes AWS');
        const params = {
            TableName: NOTES_TABLE,
            Item: note
        };
        this.getNotesFromAWS().then((data: ScanOutput) => {
            data.Items
        });
        this.documentClient.put(params, AWSCallback);
    }
    deleteNoteFromAWS(note_id: string): Promise<DeleteItemOutput> {
        const params = {
            TableName: NOTES_TABLE,
            Key: {
                'note_id': note_id
            }
        };
        return this.documentClient.delete(params).promise();
    }
    /**
    * While the code below works
    * DocumentClient.scan is very ineffecient, as such
    * Improve this as part of another issue
    * @param userId 
    * @returns 
    */
    async getNotesByUserAWS(userId: string): Promise<QueryOutput> {
        const params = {
            TableName: NOTES_TABLE,
            FilterExpression: '#userid = :user',
            ExpressionAttributeNames: {
                "#userid": "user_id"
            },
            ExpressionAttributeValues: {
                ':user': userId
            },
        };
        return this.documentClient.scan(params).promise();
    }
    async updateNoteOnAWS(note_id: string, note: Note): Promise<UpdateItemOutput> {
        const existingNote = (await this.getNoteFromAWS(note_id)).Item;
        const params = {
            TableName: NOTES_TABLE,
            Key: {
                'note_id': note_id
            },
            UpdateExpression: "set #d1 = :date, #t1 = :t, #u1 = :user",
            ExpressionAttributeValues: {
                ":date": note.date ?? existingNote?.date,
                ":t": note.text ?? existingNote?.text,
                ":user": note.user_id ?? existingNote?.user_id, 
            },
            ExpressionAttributeNames: {
                "#d1": "date",
                "#t1": "text",
                "#u1": "user"
            }
        };
        return this.documentClient.update(params).promise();
    }
    getAllNotes(): Note[] {
        let notes: Note[] = [];
        const notesStr = this.localStorage.getItem(NOTE_KEY) ? this.localStorage.getItem(NOTE_KEY) : null;
        if (!notesStr) {
            return notes;
        } else {
            if (notesStr) {
                notes = JSON.parse(notesStr);
            }
        }
        if (notes && notes.length > 0) {
            const lastNoteId = notes[(notes.length - 1)].note_id ?? 0;
            this._lastId = Number(lastNoteId);
        }
        return notes;
    }
    saveNotes(allNotes: Note[]) {
        this.notesStore = JSON.stringify(allNotes);
        this.localStorage.setItem(NOTE_KEY, this.notesStore);
    }
    saveNote(note: Note) {
        const allNotes: Note[] = this.getAllNotes();
        allNotes.push(note);
        this.saveNotes(allNotes);
        this.saveNoteToAWS(note);
    }

    updateNote(id: string, note: Note): Note | null {
        const allNotes: Note[] = this.getAllNotes();
        let existingNoteIdx: number = 0;
        const existingNote = allNotes.find((temp, idx) => {
            if (temp.note_id == id) {
                existingNoteIdx = idx;
                return temp;
            }
        });
        if (existingNote) {
            if (note.date) existingNote.date = note.date;
            if (note.text) existingNote.text = note.text;
            if (note.user_id) existingNote.user_id = note.user_id;
            allNotes[existingNoteIdx] = existingNote;
            allNotes.splice(existingNoteIdx, 1, existingNote);
            this.saveNotes(allNotes);
            return existingNote;
        }
        return null;
    }
    deleteNote(id: string): DBResult {
        const allNotes: Note[] = this.getAllNotes();
        const foundNote = allNotes.find(note => note.note_id == id);
        if (foundNote) {
            allNotes.splice(allNotes.indexOf(foundNote), 1);
            this.saveNotes(allNotes);
            return { message: "", code: 204 };
        }
        return { message: `Unable to find a note with id: ${id}`, code: 404 };
    }

}