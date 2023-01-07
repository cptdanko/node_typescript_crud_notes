import { getPredifinedUsers } from "../notes/get_all_users";
import { User } from "./user_model";

export class Note{
    private note_id : Number;
    private date : String;
    private text : String;
    private users : User[];

    private notes : Note[] | undefined;
    
    constructor(note_id: Number, date: String, text: String, user: User[]){
        this.note_id = note_id;
        this.date = date;
        this.text = text;
        this.users = getPredifinedUsers();
    }
}