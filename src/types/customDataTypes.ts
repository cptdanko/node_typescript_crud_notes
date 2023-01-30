import { DeleteItemOutput, GetItemOutput, PutItemOutput, ScanOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";

export interface Note {
    date: Date;
    text: string;
    user_id: string;
    note_id: string | null;
}

export interface DBResult {
    message: string;
    code: number;
}

export interface Todo {
    id?: string;
    text: string;
    done: boolean;
    date: Date;
    user_id: string;
}

export interface User {
    user_id?: string;
    username: string;
    email: string;
    name: string;
    dateJoined?: Date;
}
export interface CRUD<T> {

    tableName: string;

    create(data: T): Promise<PutItemOutput>;

    update(id: string, data: T): Promise<UpdateItemOutput>;

    delete(id: string): Promise<DeleteItemOutput>;

    getAll(): Promise<ScanOutput>;

    get(id: string): Promise<GetItemOutput>;

}