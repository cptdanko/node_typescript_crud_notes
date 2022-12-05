import { Request, Response } from "express";
import { LocalStorage } from "node-localstorage";

export default function getAllUsers(request: Request, response: Response) {
    const users = [
        {
            name: "Bhuman",
            age: 40
        },
        {
            name: "Yakang",
            age: "32"
        }
    ];
    response.statusCode = 200;
    response.send(users);
}