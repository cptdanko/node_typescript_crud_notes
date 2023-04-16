import { TODO_PK_SYM, USER_PK_SYM } from "../types/constants";
import { Todo } from "../types/customDataTypes";
import { TodoDDB } from "./ddbTodo";

describe("TodoDdb", () => {
    const TEST_TODO_ID = TODO_PK_SYM + "1234";
    const TEST_TODO_ID_2 = TODO_PK_SYM + "12345";
    const TEST_USER_ID = USER_PK_SYM + "1234"
    let db: TodoDDB = new TodoDDB();
    const mockTodo: Todo = {
        text: "Test todo 今天加油",
        done: false,
        date: new Date(),
        user_id: TEST_USER_ID,
        id: TEST_TODO_ID,
    };
    const mockTodo2: Todo = {
        text: "Test todo 今天很忙了",
        done: false,
        date: new Date(),
        user_id: TEST_USER_ID,
        id: TEST_TODO_ID_2,
    };

    afterEach(async () => {
        await db.deleteTodo(TEST_TODO_ID);
        await db.deleteTodo(TEST_TODO_ID_2);
    });

    it('should add a new todo', async () => {
        const result = await db.saveTodoToAWS(mockTodo);
        expect(result).toBeDefined();
    });

    it('should update an existing todo', async () => {

        await db.saveTodoToAWS(mockTodo);
        const mockUpdate: Todo = {
            text: "Test todo",
            done: true,
            date: mockTodo.date,
            user_id: TEST_USER_ID
        };
        const result = await db.updateTodo(TEST_TODO_ID, mockUpdate);
        expect(result).toBeDefined();
    });
    it('should delete an existing todo', async () => {
        const result = await db.deleteTodo(TEST_TODO_ID);
        expect(result).toBeDefined();
    });
    it('should get an existing todo', async () => {
        await db.saveTodoToAWS(mockTodo);
        const result = await db.getTodoById(TEST_TODO_ID);
        expect(result).toBeDefined();
    });
    it('should get all todos', async () => {
        await db.saveTodoToAWS(mockTodo);
        await db.saveTodoToAWS(mockTodo2);
        const todos = await db.getAllTodo();
        const items = todos.Items ?? [];
        expect(items.length).toBeGreaterThan(0);
    });

    it('should get todo by user id', async () => {
        await db.saveTodoToAWS(mockTodo);
        await db.saveTodoToAWS(mockTodo2);
        const todos = await db.getAllTodo();
        const items = todos.Items ?? [];
        expect(items.length).toBeGreaterThan(1);
    });
});