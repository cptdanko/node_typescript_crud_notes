export class User{
    private name : String;
    private age : Number;
    private id : Number;

     constructor(id: Number, name : String, age : Number){
        this.name = name;
        this.age = age;
        this.id = id;
     }

     public getName(){
      return this.name;
     }
     public getAge(){
      return this.age;
     }
     public getId(){
      return this.id;
     }
}