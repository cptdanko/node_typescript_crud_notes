import {
    DeleteItemOutput,
    GetItemOutput,
    PutItemOutput,
    ScanOutput,
} from "aws-sdk/clients/dynamodb";
import { Request, Response } from "express";
import { DynamoDB } from "../datastore/aws";
import { TODO_PK_SYM } from "../types/constants";
import { Todo } from "../types/customDataTypes";

const dynamoDb = new DynamoDB();

export async function saveTodo(request: Request, response: Response) {
    //validate the note
    console.log(`Received request to crud todo`);
    const reqBody = request.body;
    if (reqBody == null) {
        response.statusCode = 400;
        response.send("Error: a todo create request must have a body");
    }
    const todo = reqBody as Todo;
    todo.id = TODO_PK_SYM + new Date().getTime();
    console.log(`Todo obj to be saved -> ${JSON.stringify(todo)}`);

    dynamoDb
        .saveTodoToAWS(todo)
        .then(async (resp) => {
            console.log(`Save successful`);
            response.statusCode = 201;
            const dbTodo = (await dynamoDb.getTodoById(todo.id!)).Item;
            response.send(dbTodo);
        })
        .catch((err) => {
            console.log("Error occured");
            console.error(err);
            response.statusCode = 400;
            response.send(err.message);
        });
}

export function getAllTodo(request: Request, response: Response) {
    
    dynamoDb
        .getAllTodo()
        .then((data: ScanOutput) => {
            response.statusCode = 200;
            const returnVal = data.Items ?? {};
            console.log(JSON.stringify(returnVal));
            response.send(returnVal);
        }).catch((err) => {
            console.error(err);
            response.statusCode = 400;
            response.send(err.message);
        });
}

export async function getTodo(request: Request, response: Response) {
    const id = request.params && request.params.id;
    if (!id) {
        response.statusCode = 400;
        response.send("No query params passed, need to pass the id");
        return;
    }
    const todoId = id;
    dynamoDb
        .getTodoById(todoId)
        .then((data: GetItemOutput) => {
            response.statusCode = 200;
            response.send(data.Item);
        })
        .catch((err) => {
            console.error(err);
            response.statusCode = 400;
            response.send(err.message);
        });
}
/*
    Modify this code to have createUpdate
    201 resp code if created
    200 resp code if updated
*/
export async function updateTodo(request: Request, response: Response) {
    const queryId = request.query.id as string;
    const updateTodoBody = request.body as Todo;
    if (queryId.length == 0) {
        response.statusCode = 400;
        response.send("Invalid todo id passed");
    }
    if (Object.keys(updateTodoBody).length == 0) {
        response.statusCode = 400;
        response.send("Invalid update body passed");
    }
    dynamoDb
        .updateTodo(queryId, updateTodoBody)
        .then((value) => {
            response.statusCode = 200;
            response.send("");
        })
        .catch((err) => {
            console.error(err);
            response.statusCode = 500;
            response.send(`Error -> ${err}`);
        });
}

export async function deleteTodo(request: Request, response: Response) {
    console.log("In delete todo");
    console.log(JSON.stringify(request.query));

    if (Object.keys(request.query).length == 0 || !request.query.id) {
        response.statusCode = 400;
        response.send("No todo id param supplied");
    } else {
        const queryParam = request.query.id as string;
        const todo = await dynamoDb.getTodoById(queryParam);
        if (!todo) {
            response.statusCode = 404;
            response.send("Note with id not found");
        } else {
            dynamoDb
                .deleteTodo(queryParam)
                .then((res: DeleteItemOutput) => {
                    response.statusCode = 204;
                    response.send(res);
                })
                .catch((err) => {
                    const errMsg = `Delete failed because ${err}`;
                    response.statusCode = 500;
                    response.send(errMsg);
                });
        }
    }
}
