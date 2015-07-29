var vm = todo.vm

m("button", {onclick: vm.add.bind(vm, vm.description)}, "Add")

//onclick: function(e) {
//    todo.vm.add(todo.vm.description)
//}
