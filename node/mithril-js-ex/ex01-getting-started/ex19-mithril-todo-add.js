vm.add = function() {
    if (vm.description()) {
        vm.list.push(new todo.Todo({description: vm.description()}));
        vm.description("");
    }
};

m("button", {onclick: todo.vm.add}, "Add")
