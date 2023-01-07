import { getAllPredefinedNotes } from "./get_all_notes";
import {Request, Response} from 'express';
import { getPredifinedUsers } from "./get_all_users";

export class NotesController{
    
      static getAllNotes(request : Request, response : Response){
        const allNotes = getAllPredefinedNotes();
        return response.json(allNotes).status(200);
    }   

    static getUserById(request: Request, response : Response){
        var users = getPredifinedUsers();
                     
                  var user =   users
                                .filter((u) => u.getId() == request.body.user_id);

        return response.json(user.length < 1  ? "User Not Found" : user)
        .status(200);

    }
}