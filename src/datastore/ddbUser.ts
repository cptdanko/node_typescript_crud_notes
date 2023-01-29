
import AWS from "aws-sdk";
import { PutItemOutput, UpdateItemOutput, DeleteItemOutput, ScanOutput, GetItemOutput } from "aws-sdk/clients/dynamodb";
import { USER_TABLE } from "../types/constants";
import { CRUD, User } from "../types/customDataTypes";

export class UserDdb implements CRUD<User> {
    tableName: string = USER_TABLE;

    regionParam = { region: "ap-southeast-2" };
    ddb = new AWS.DynamoDB(this.regionParam);
    documentClient = new AWS.DynamoDB.DocumentClient(this.regionParam);
    
    create(data: User): Promise<PutItemOutput> {
        const params = {
            TableName: this.tableName,
            Item: data
        };
        return this.documentClient.put(params).promise();
    }
    async update(id: string, data: User): Promise<UpdateItemOutput> {
        const user = (await(this.get(id))).Item;
        const params = {
            TableName: this.tableName,
            Key: {
              'user_id': id
            },
            UpdateExpression: "set #d1 = :username, #t1 = :email, #f1 = :name",
            ExpressionAttributeValues: {
              ":username": data.username ?? user?.username,
              ":email": data.email ?? user?.email,
              ":name": data.name ?? user?.name
            },
            ExpressionAttributeNames: {
              "#d1": "username",
              "#t1": "email",
              "#f1": "name"
            }
          }
        return this.documentClient.update(params).promise();
    }
    delete(id: string): Promise<DeleteItemOutput> {
        const params = {
            TableName: this.tableName,
            Key: {
              'user_id': id
            }
          }
          return this.documentClient.delete(params).promise();
    }
    getAll(): Promise<ScanOutput> {
        const params = {
            TableName: this.tableName
        };
        return this.documentClient.scan(params).promise();
    }
    get(id: string): Promise<GetItemOutput> {
        const getParams = {
            TableName: this.tableName,
            Key: {
                'user_id': id
            }
        };
        return this.documentClient.get(getParams).promise();
    }
    
}