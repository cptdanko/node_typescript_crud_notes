import { Note } from "./src/types/customDataTypes";

const mockData: Note[] = [{
    "date": new Date(),
    "text": "Hare Rama Hare Krishna",
    "user": "{'name': 'Connie', 'age': 32}",
    "note_id": '1'
},
{
    "date": new Date(),
    "text": "Together we must rule the galaxy",
    "user": "{'name': 'Darth', 'age': 42}",
    "note_id": '2'
},
{
    "date": new Date(),
    "text": "Make peace no war",
    "user": "{'name': 'Shantaram', 'age': 27}",
    "note_id": '3'
}];

export default mockData;