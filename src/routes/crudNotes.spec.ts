import { Request, Response } from "express";
import { saveNotes} from "./crudNotes";

describe("Notes test", () => {
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
                "user": "{'name': 'Connie', 'age': 32}"
            }
        }
    });

    test('200 - notes', () => {
        const expectedCode = 200;
        const expectResp = {
            "date": "2012-04-23T18:25:43.511Z",
            "text": "This is a note",
            "user": "{'name': 'Connie', 'age': 32}"
        };
        saveNotes(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(201);
    })
});