//define the view-model
todo.vm = {
    init: function() {
        //a running list of todos
        todo.vm.list = new todo.TodoList();

        //a slot to store the name of a new todo before it is created
        todo.vm.description = m.prop('');

        //adds a todo to the list, and clears the description field for user convenience
        todo.vm.add = function(description) {
            if (description()) {
                todo.vm.list.push(new todo.Todo({description: description()}));
                todo.vm.description("");
            }
        };
    }
};
