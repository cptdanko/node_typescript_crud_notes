import { Request, Response } from "express";
import { UserDdb } from "../datastore/ddbUser";
import { USER_PK_SYN } from "../types/constants";
import { User } from "../types/customDataTypes";
import { DeleteItemOutput, GetItemOutput, PutItemOutput, QueryOutput, ScanOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";

const userDdb = new UserDdb();

export function saveUser(request: Request, response: Response) {

    console.log("request to save user");
    const reqBody = request.body;
    if (reqBody == null) {
        response.statusCode = 400;
        response.send("Error: a todo create request must have a body");
    }
    const user = reqBody as User;
    user.user_id = USER_PK_SYN + new Date().getTime();
    userDdb.create(user)
    .then(async (resp) => {
        const ddbUser = (await userDdb.get(user.user_id!)).Item;
        response.statusCode = 201;
        response.send(ddbUser);
    }).catch((err) => {
        response.statusCode = 400;
        response.send(err.message);
    });    
}

export async function getUser(request: Request, response: Response) {
    const id = request.params && request.params.id;
    if (!id) {
        response.statusCode = 400;
        response.send("No query params passed, need to pass the id");
        return;
    }
    const userId = id;
    userDdb.get(userId)
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
export async function getUsers(request: Request, response: Response) {
    userDdb.getAll().then(data => {
        response.statusCode = 200;
        response.send(data.Items);
    }).catch(err => {
        console.error(err);
        response.statusCode = 400;
        response.send(err.message);
    })
}

export async function updateUser(request: Request, response: Response) {
    const queryId = request.query.userId as string;
    const updateTodoBody = request.body as User;
    if (Object.keys(request.query).length == 0 || !request.query.userId) {
        response.statusCode = 400;
        response.send("Id missing");
    }
    if (Object.keys(updateTodoBody).length == 0) {
        response.statusCode = 400;
        response.send("Update body missing");
    }
    userDdb.update(queryId, updateTodoBody)
        .then((value) => {
            response.statusCode = 201;
            response.send("");
        })
        .catch((err) => {
            console.error(err);
            response.statusCode = 500;
            response.send(`Error -> ${err}`);
        });

}
export async function deleteUser(request: Request, response: Response) {
    if (Object.keys(request.query).length == 0 || !request.query.userId) {
        response.statusCode = 400;
        response.send("Id missing");
    } else {
        const queryParam = request.query.userId as string;
        const user = await userDdb.get(queryParam);
        if (!user) {
            response.statusCode = 404;
            response.send(`User with id ${user} not found`);
        } else {
            userDdb.delete(queryParam)
            .then((res: DeleteItemOutput) => {
                response.statusCode = 204;
                response.send(res);
            }).catch((err) => {
                const errMsg = `Delete failed because ${err}`;
                response.statusCode = 500;
                response.send(errMsg);
            });
        }
    }
}

export async function getUserByEmail(request: Request, response: Response) {
    const email = request.params && request.params.email;
    if (!email) {
        response.statusCode = 400;
        response.send("No email passed, need email address to retrieve user");
        return;
    }
    userDdb.getByEmail(email)
    .then((data: QueryOutput) => {
        response.statusCode = 200;
        response.send(data.Items);
    })
    .catch((err) => {
        console.error(err);
        response.statusCode = 400;
        response.send(err.message);
    })
}