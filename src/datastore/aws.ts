import AWS from "aws-sdk";
import { DeleteItemOutput, GetItemOutput, PutItemOutput, ScanOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { TODO_TABLE } from "../types/constants";
import { Todo } from "../types/customDataTypes";

export class DynamoDB {
  regionParam = { region: "ap-southeast-2" };
  ddb = new AWS.DynamoDB(this.regionParam);
  documentClient = new AWS.DynamoDB.DocumentClient(this.regionParam);

  params = {
    TableName: TODO_TABLE
  } as const;
  
  async saveTodoToAWS(
    todo: Todo
  ): Promise<PutItemOutput> {
    const params = {
        TableName: TODO_TABLE,
        Item: todo
    };
    return this.documentClient.put(params).promise();
  }

  getLastSaveTodo(): Promise<GetItemOutput> {
    const getParams = Object.assign(this.params);
    return this.documentClient.get(getParams).promise();
  }

  getTodoById(id: string): Promise<GetItemOutput> {
    const getParams = {
        TableName: TODO_TABLE,
        Key: {
            'id': id
        }
    };
    return this.documentClient.get(getParams).promise();
  }

  getAllTodo(): Promise<ScanOutput> {
    const params = {
        TableName: TODO_TABLE
    };
    return this.documentClient.scan(params).promise();
  }

  async updateTodo(todo_id: string, todo: Todo): Promise<UpdateItemOutput> {
    const existingTodo = (await this.getTodoById(todo_id)).Item;
    const params = {
      TableName: TODO_TABLE,
      Key: {
        'id': todo_id
      },
      UpdateExpression: "set #d1 = :date, #t1 = :text, #f1 = :done",
      ExpressionAttributeValues: {
        ":date": todo.date ?? existingTodo?.date,
        ":text": todo.text ?? existingTodo?.text,
        ":done": todo.done ?? existingTodo?.done
      },
      ExpressionAttributeNames: {
        "#d1": "date",
        "#t1": "text",
        "#f1": "done"
      }
    }
    return this.documentClient.update(params).promise();
  }

  deleteTodo(todoId: string): Promise<DeleteItemOutput> {
    const params = {
      TableName: TODO_TABLE,
      Key: {
        'id': todoId
      }
    }
    return this.documentClient.delete(params).promise();
  }
}
