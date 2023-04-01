import {
    DeleteItemOutput,
    GetItemOutput,
    QueryOutput,
    ScanOutput,
} from "aws-sdk/clients/dynamodb";
import { Request, response, Response } from "express";
import { request } from "http";
import { TodoDDB } from "../datastore/ddbTodo";
import { TODO_PK_SYM } from "../types/constants";
import { Todo } from "../types/customDataTypes";

const dynamoDb = new TodoDDB();

export async function saveTodo(request: Request, response: Response) {
    //validate the note
    const reqBody = request.body;
    if (reqBody == null) {
        response.statusCode = 400;
        response.send("Error: a todo create request must have a body");
    }
    const todo = reqBody as Todo;
    todo.id = TODO_PK_SYM + new Date().getTime();
    dynamoDb
        .saveTodoToAWS(todo)
        .then(async (resp) => {
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
            const itemsStr = JSON.stringify(returnVal);
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
export async function getTodoForUser(request: Request, response: Response) {
    if (Object.keys(request.query).length == 0 || !request.query.userId) {
        response.statusCode = 404;
        response.send("User id not found");
    } else {
        const queryParam = request.query.userId as string;
        dynamoDb.getTodoByUser(queryParam)
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
}

export function searchTodo(request: Request, response: Response) {

    if(!request.body) {
        response.statusCode = 400;
        response.send("Search parameters missing");
    }

    if(typeof request.body.searchText != 'string') {
        response.statusCode = 422;
        response.send('Search text must be string');
    }
    //do the actual search througn the DB
    const userid = request.body.userId;
    const searchText = request.body.searchText;
    dynamoDb.getMatchingTodo(searchText, userid).then(data => {
        response.status(200).send(data);
    }).catch(err => {
        response.status(500).send(err);
    });
}