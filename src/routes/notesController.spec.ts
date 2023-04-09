import { Request, Response } from "express";
import { deleteNote, getNote, getNotesForUser, saveNotes, updateNote} from "./notesController";
import { NotesDB } from "../datastore/ddbNote";
import { Note } from "../types/customDataTypes";


describe("Notes test", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObj: Object = {"name": "Notes"};
    const mockNote: Note = {
        date: new Date(),
        text: "My mock note",
        user_id: "USR_1234",
        note_id: "NT_1234"
    }
    const noteResolve = new Promise<any>((resolve) => resolve([mockNote]));
    const getNotePromise = new Promise<any>((resolve) => resolve({Item: mockNote}));
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            statusCode: 201,
            send: jest.fn().mockImplementation(result => {
                responseObj = result;
            })
        };
        mockRequest = {
            body: {
                "date": "2012-04-23T18:25:43.511Z",
                "text": "This is a note",
                "user": "{'name': 'Connie'}"
            }
        }
        jest.spyOn(NotesDB.prototype, "getNotesByUserAWS").mockReturnValue(noteResolve);
        jest.spyOn(NotesDB.prototype, "getNoteFromAWS").mockReturnValue(getNotePromise);
        jest.spyOn(NotesDB.prototype, "updateNoteOnAWS").mockReturnValue(noteResolve);
        jest.spyOn(NotesDB.prototype, "deleteNoteFromAWS").mockReturnValue(noteResolve);

    });
    it("Should return 400 when trying to get notes for user without userid", async () => {
        await getNotesForUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });
    it("Should return 200 when trying to get notes for user", async () => {
        mockRequest.query = {"userId": "USR_1234"};
        await getNotesForUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(200);
    });
    it("Should return 400 when trying to get a note without id", async () => {
        await getNote(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });
    it("Should return 200 when trying to get a note", async () => {
        mockRequest.params = {"id": "NT_1234"};
        mockRequest.headers = { "aws-cloud": "true" };
        await getNote((mockRequest as Request), mockResponse as Response);
        expect(mockResponse.statusCode).toBe(200);
    });

    it("Should rerturn 400 when trying update note without id or body", async () => {
        mockRequest.query = {"id": "NT_1234"};
        mockRequest.headers = { "aws-cloud": "true" };
        mockRequest.body = null;
        await updateNote((mockRequest as Request), mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
        mockRequest.body = mockNote;
        mockRequest.query = {};
        await updateNote((mockRequest as Request), mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });
    it("Should return 204 updated on updating note", async () => {
        mockRequest.query = {"id": "NT_1234"};
        mockRequest.headers = { "aws-cloud": "true" };
        mockRequest.body = mockNote;
        await updateNote((mockRequest as Request), mockResponse as Response);
        expect(mockResponse.statusCode).toBe(204);
    });
    /**
    /**
     * NOTE: to be updated soon
     */
    it('200 - notes', async () => {
        const expectResp = {
            "date": "2012-04-23T18:25:43.511Z",
            "text": "This is a note",
            "user": "{'name': 'Connie', 'age': 22}"
        };
        await saveNotes(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(201);
    });

    it('Should throw 400/404 when invalid note id passed to delete note', async () => {
        const expectedCode = 400;
        await deleteNote(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });
    
    it('Should give 404 when note with id does not exist', async () => {
        mockRequest.headers = { "aws-cloud": "true" };
        jest.spyOn(NotesDB.prototype, "getNoteFromAWS").mockImplementation(() => new Promise((resolve) => resolve({})));
        mockRequest.query = {};
        await deleteNote(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);

        mockRequest.query = {"id": "NT_1234"};
        await deleteNote(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(404);
    });
    it('Should give 204 when note with id exists', async () => {
        jest.spyOn(NotesDB.prototype, "getNoteFromAWS").mockReturnValue(getNotePromise);
        mockRequest.headers = { "aws-cloud": "true" };
        mockRequest.query = {"id": "NT_1234"};
        await deleteNote(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(204);
    });

});