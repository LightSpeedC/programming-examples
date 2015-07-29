todo.vm.init();

todo.vm.description(); // empty string
m.render(document, todo.view()); // input is blank

todo.vm.description("Write code"); //set the description in the controller
m.render(document, todo.view()); // input now says "Write code"
