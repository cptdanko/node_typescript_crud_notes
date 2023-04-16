import { USER_PK_SYM } from "../types/constants";
import { User } from "../types/customDataTypes";
import { UserDdb } from "./ddbUser";

describe('UserDdb', () => {
    const TEST_USER_ID = USER_PK_SYM + "1234"
    let db: UserDdb = new UserDdb();

    afterEach(async () => {
        await db.delete(TEST_USER_ID);
    });
    it('should create a new user', async () => {
        const data: User = {
            user_id: TEST_USER_ID,
            name: 'John Doe',
            email: 'johndoe@example.com',
            username: "jdoe",
        };
        const result = await db.create(data);
        expect(result).toBeDefined();
    });

    it('should update an existing user', async () => {
        const data: User = {
            user_id: TEST_USER_ID,
            name: 'John Doe',
            email: 'johndoe@example.com',
            username: "jdoe",
        };
        await db.create(data);
        const newData: User = {
            user_id: TEST_USER_ID,
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            username: "jdoe",
        };
        const result = await db.update(TEST_USER_ID, newData);
        expect(result).toBeDefined();
    });
    it('should delete an existing user', async () => {
        const result = await db.delete(TEST_USER_ID);
        expect(result).toBeDefined();
    });
    it('should get an existing user', async () => {
        const data: User = {
            user_id: TEST_USER_ID,
            name: 'John Doe',
            email: 'johndoe@example.com',
            username: "jdoe",
        };
        await db.create(data);
        const result = await db.get(TEST_USER_ID);
        expect(result).toBeDefined();
    });
    it('should get user by email', async () => {
        const data: User = {
            user_id: TEST_USER_ID,
            name: 'John Doe',
            email: 'johndoe@example.com',
            username: "jdoe",
        };
        await db.create(data);
        const result = await db.getByEmail("johndoe@example.com");
        expect(result).toBeDefined();
    });
});