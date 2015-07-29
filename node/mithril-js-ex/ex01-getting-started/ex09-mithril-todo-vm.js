//initialize our view-model
todo.vm.init();

todo.vm.description(); //[empty string]

//try adding a to-do
todo.vm.add(todo.vm.description);
todo.vm.list.length; //0, because you can't add a to-do with an empty description

//add it properly
todo.vm.description("Write code");
todo.vm.add(todo.vm.description);
todo.vm.list.length; //1
