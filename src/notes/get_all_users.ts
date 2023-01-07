import { User } from "../types/user_model";

export function getPredifinedUsers(){
    return [
        new User(1, 'Bhuman', 40),
        new User(2, 'Yakang', 32)
    ];
 }