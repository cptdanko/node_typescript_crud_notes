import { DBResult } from "../types/customDataTypes";

export const AWSCallback = (err: AWS.AWSError, data: AWS.DynamoDB.DocumentClient.PutItemOutput): DBResult => {
    if(err) {
        console.log(`Error saving notes -> ${err}`);
        return { code: 500, message: `${err}`};
    } else {
        return { code: 201, message: `Note saved`};
    }
}