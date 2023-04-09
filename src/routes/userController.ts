import { Request, Response } from "express";
import { UserDdb } from "../datastore/ddbUser";
import { USER_PK_SYN } from "../types/constants";
import { User } from "../types/customDataTypes";
import { DeleteItemOutput, GetItemOutput, QueryOutput,} from "aws-sdk/clients/dynamodb";

const userDdb = new UserDdb();

export function saveUser(request: Request, response: Response) {

    if (!request.body) {
        response.statusCode = 400;
        response.send("Error: a todo create request must have a body");
        return;
    }
    const user = request.body as User;
    user.user_id = USER_PK_SYN + new Date().getTime();
    userDdb.create(user)
    .then(async (resp) => {
        response.statusCode = 201;
        response.send(user);
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
        response.statusCode = 500;
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
    const queryId = request.query && request.query.userId as string;
    const updateTodoBody = request.body && request.body as User;
    if (!queryId) {
        response.statusCode = 400;
        response.send("Id missing");
        return;
    }
    if (!updateTodoBody) {
        response.statusCode = 400;
        response.send("Update body missing");
        return;
    }
    userDdb.update(queryId, updateTodoBody)
        .then((value) => {
            response.statusCode = 204;
            response.send("");
        })
        .catch((err) => {
            console.error(err);
            response.statusCode = 500;
            response.send(`Error -> ${err}`);
        });

}
export async function deleteUser(request: Request, response: Response) {
    const userId = request.query && (request.query.userId as string);
    if (!userId) {
        response.statusCode = 400;
        response.send("Id missing");
        return;
    }
    const user = await userDdb.get(userId);
    if (!user) {
        response.statusCode = 404;
        response.send(`User with id ${user} not found`);
        return;
    }
    userDdb.delete(userId)
    .then((res: DeleteItemOutput) => {
        response.statusCode = 204;
        response.send(res);
    }).catch((err) => {
        const errMsg = `Delete failed because ${err}`;
        response.statusCode = 500;
        response.send(errMsg);
    });
    console.log("After delete");
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