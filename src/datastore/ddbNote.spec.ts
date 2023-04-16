import { NOTE_PK_SYM, USER_PK_SYM } from "../types/constants";
import { Note } from "../types/customDataTypes";
import { NotesDB } from "./ddbNote";

describe("NoteDdb", () => {
    let db = new NotesDB();
    const TEST_USER_ID = USER_PK_SYM + "1234";
    const TEST_NOTE_ID = NOTE_PK_SYM + "1234";
    const TEST_NOTE_ID_2 = NOTE_PK_SYM + "12345";
    const mockNote: Note = {
        date: new Date(),
        text: "Test note",
        note_id: TEST_NOTE_ID,
        user_id: TEST_USER_ID
    };
    const mockNote2: Note = {
        date: new Date(),
        text: "Test note 2",
        note_id: TEST_NOTE_ID_2,
        user_id: TEST_USER_ID
    };
    
    afterEach(async () => {
        await db.deleteNoteFromAWS(TEST_NOTE_ID);
        await db.deleteNoteFromAWS(TEST_NOTE_ID_2);
    });
    it('should add a new note', async () => {
        const result = await db.saveNoteToAWS(mockNote);
        expect(result).toBeDefined();
    });

    it('should update an existing note', async () => {

        await db.saveNoteToAWS(mockNote);
        const mockNoteUpdate: Note = {
            date: new Date(),
            text: "Test note update",
            note_id: TEST_NOTE_ID,
            user_id: TEST_USER_ID
        };
        const result = await db.updateNoteOnAWS(TEST_NOTE_ID, mockNoteUpdate);
        expect(result).toBeDefined();
    });
    it('should delete an existing note', async () => {
        const result = await db.deleteNoteFromAWS(TEST_NOTE_ID);
        expect(result).toBeDefined();
    });
    it('should get an existing note ', async () => {
        await db.saveNoteToAWS(mockNote);
        const result = await db.getNoteFromAWS(TEST_NOTE_ID);
        expect(result).toBeDefined();
    });
    it('should get all notes', async () => {
        await db.saveNoteToAWS(mockNote);
        await db.saveNoteToAWS(mockNote2);
        const notes = await db.getNotesByUserAWS(TEST_USER_ID)
        const items = notes.Items ?? [];
        expect(items.length).toBeGreaterThan(0);
    });
});