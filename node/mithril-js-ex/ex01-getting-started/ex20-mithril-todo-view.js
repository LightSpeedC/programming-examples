//here's the view
m("table", [
    todo.vm.list.map(function(task, index) {
        return m("tr", [
            m("td", [
                m("input[type=checkbox]")
            ]),
            m("td", task.description()),
        ])
    })
])
