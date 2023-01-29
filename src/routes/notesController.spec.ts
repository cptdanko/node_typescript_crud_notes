import { Request, Response } from "express";
import { deleteNote, saveNotes} from "./notesController";

describe.skip("Notes test", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObj: Object;

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
    });

    /**
     * NOTE: to be updated soon
     */
    test('200 - notes', () => {
        const expectedCode = 200;
        const expectResp = {
            "date": "2012-04-23T18:25:43.511Z",
            "text": "This is a note",
            "user": "{'name': 'Connie', 'age': 32}"
        };
        saveNotes(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(201);
    });

    test('400 - no query param id supplied to delete note', () => {
        const expectedCode = 400;
        deleteNote(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });
    
    test('400 - note with id does not exist', () => {
        const expectedCode = 404;
        mockRequest.query = {};
        mockRequest.query.id = "3";
        deleteNote(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(expectedCode);
       
    });
});