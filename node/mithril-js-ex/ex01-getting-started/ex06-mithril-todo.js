var myTask = new todo.Todo({description: "Write code"});

//read the description
myTask.description(); //Write code

//is it done?
var isDone = myTask.done(); //isDone == false

//mark as done
myTask.done(true); //true

//now it's done
isDone = myTask.done(); //isDone == true
