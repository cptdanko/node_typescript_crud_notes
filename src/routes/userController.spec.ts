import { Request, Response } from "express";
import { deleteUser, getUser, saveUser, updateUser } from './userController';
import { UserDdb } from "../datastore/ddbUser";
import { resolve } from "path";
import { User } from "../types/customDataTypes";
//jest.mock("../datastore/ddbUser");
//const mockUserDb = jest.mocked(UserDdb);

describe("Users test", () => {
    let mockRequest: Partial<Request> = {};
    let mockResponse: Partial<Response> = {};
    let responseObj: Object = {};
    const mockUser: User = {
        email: "bhuman.soni@gmail.com",
        username: "cptdanko",
        name: "Bhuman Soni",
    };
    const mockUserPromiseVal = new Promise<any>((resolve) => resolve(mockUser));
    beforeEach(() => {        
        mockRequest = {};
        mockResponse = {
            statusCode: 201,
            send: jest.fn().mockImplementation(result => {
                responseObj = result;
            })
        };
        
        
        jest.spyOn(UserDdb.prototype, "create").mockReturnValue(mockUserPromiseVal);
        jest.spyOn(UserDdb.prototype, "get").mockReturnValue(mockUserPromiseVal);
        jest.spyOn(UserDdb.prototype, "delete").mockReturnValue(mockUserPromiseVal);
        jest.spyOn(UserDdb.prototype, "update").mockReturnValue(mockUserPromiseVal);
    });

    it("should return 400 response when no post body is passed", async () => {
        mockRequest.body = {};
        await saveUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(201);
    });
    it("should return 201 response when post body is passed", async () => {
        mockRequest.body = {"id": "random", "email": "joeblogs@mydaytodo.com"};
        await saveUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(201);
    });
    it("should return 400 response when no post body passed", async () => {
        //mockRequest = undefined;
        await saveUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });
    it("should return 400 when user id not supplied to get user", async () => {
        await getUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });
    it("should return 200 when user id passed to get user", async () => {
        mockRequest.query = {"id": "USR_1234"};
        await getUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });
    it("should return 400 | 404 error when invalid user id passed to delete", async () => {
        jest.spyOn(UserDdb.prototype, "get").mockReturnValue(new Promise<any>((resolve) => resolve(null)));
        mockRequest.query = {};
        await deleteUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);

        mockRequest.query = {"userId": "USR_1234"};
        await deleteUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(404);
    });

    it("should return 204 when valid user Id passed to delete", async () => {
        mockRequest.query = {"userId": "USR_1234"};
        await deleteUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(204);
    });

    it("should return 400 | 404 when user id or body not passed to update user", async () => {
        await updateUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);

        mockRequest.query = {"userId": "USR_1234"};
        mockRequest.body = null;
        await updateUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });

    
    it("should return 204 on valid update user call", async () => {
        mockRequest.query = {"userId": "USR_1234"};
        mockRequest.body = mockUser;
        await updateUser(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(204);
    });
});