import { Note } from "../types/note_model";
import { getPredifinedUsers } from "./get_all_users";

export function getAllPredefinedNotes(){
        return [
            new Note(1, new Date().toUTCString() , "My First Note", getPredifinedUsers()),
            new Note(2, new Date().toUTCString(), "My Second Note", getPredifinedUsers())
        ];
}