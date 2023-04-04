import { Request, Response } from "express";
import { TodoDDB } from "../datastore/ddbTodo";
import { deleteTodo, getAllTodo, getTodo, saveTodo, updateTodo } from "./todoController";
import { Todo } from "../types/customDataTypes";
jest.mock("../datastore/ddbTodo");
const mockedTodoDDB = jest.mocked(TodoDDB, {shallow: false});

describe("Todo", () => {
    const mockTodo: Todo = {
        text: "Test todo",
        done: false,
        date: new Date(),
        user_id: "USR_1235"
    };
    let mockRequest: Partial<Request> = {};
    let mockResponse: Partial<Response> = {};
    let responseObj = {};
    mockResponse = {
        status: jest.fn(),
        send: jest.fn().mockImplementation(result => {
            responseObj = result;
        })
    };

    beforeEach(() => {
        mockedTodoDDB.mockClear();
        const todoResolve = new Promise<any>((resolve, reject) => resolve(mockTodo));
        const todoResolveArr = new Promise<any>((resolve, reject) => resolve([mockTodo]));
        jest.spyOn(TodoDDB.prototype, "saveTodoToAWS").mockImplementation(() => todoResolve);
        jest.spyOn(TodoDDB.prototype, "getAllTodo").mockImplementation(() => todoResolveArr);
        jest.spyOn(TodoDDB.prototype, "getTodoById").mockImplementation(() => todoResolve);
        jest.spyOn(TodoDDB.prototype, "updateTodo").mockImplementation(() => todoResolve);
        jest.spyOn(TodoDDB.prototype, "deleteTodo").mockImplementation(() => new Promise((resolve) => resolve({})));
    })

    it("Should get 400 response when saving without body", async () => {
        await saveTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });

    it("Should get 201 create when saving with valid body", async () => {
        mockRequest.body = mockTodo;
        await saveTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(201);
    });

    it("Should return a 200 response when getting all todo", async () => {
        await getAllTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(200);
    });

    it("Should return 400 error when get todo without id", async () => {
        await getTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });

    it("Should return 200 when getTodo with id passed", async () => {
        mockRequest.params = {};
        mockRequest.params.id = "TD_12345";
        await getTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(200);
    });

    it("Should return 400 error when no id or update body passed to update todo", async () => {
        await updateTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
        mockRequest.query = {};
        mockRequest.query.id = "TD_12345";
        mockRequest.body = undefined;
        await updateTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(400);
    });
    it("Should return 204 success params and body are passed to update todo", async () => {
        mockRequest.query = {};
        mockRequest.query.id = "TD_12345";
        mockRequest.body = mockTodo;
        await updateTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(204);
    });
    it("Should return 204 success params and body are passed to update todo", async () => {
        mockRequest.query = {};
        mockRequest.query.id = "TD_12345";
        mockRequest.body = mockTodo;
        await updateTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(204);
    });

    it("Should return 404 when todo with id not found when trying to delete", async () => {
        jest.spyOn(TodoDDB.prototype, "getTodoById").mockImplementation(() => new Promise((resolve, reject) => resolve({})));
        mockRequest.query = {};
        mockRequest.query.id = "TD_12345";
        await deleteTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(404);
    });
    it("Should return 204 deleted when deleting a todo", async () => {
        mockRequest.query = {};
        mockRequest.query.id = "TD_12345";
        await deleteTodo(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.statusCode).toBe(204);
    });
})
