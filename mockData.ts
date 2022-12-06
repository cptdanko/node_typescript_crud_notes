import { Note } from "./src/routes/crudNotes";

const mockData: Note[] = [{
    "date": new Date(),
    "text": "Hare Rama Hare Krishna",
    "user": "{'name': 'Connie', 'age': 32}",
    "id": 1
},
{
    "date": new Date(),
    "text": "Together we must rule the galaxy",
    "user": "{'name': 'Darth', 'age': 42}",
    "id": 2
},
{
    "date": new Date(),
    "text": "Make peace no war",
    "user": "{'name': 'Shantaram', 'age': 27}",
    "id": 3
}];

export default mockData;