todo.view = function() {
    return m("html", [
        m("body", [
            m("input"),
            m("button", "Add"),
            m("table", [
                m("tr", [
                    m("td", [
                        m("input[type=checkbox]")
                    ]),
                    m("td", "task description"),
                ])
            ])
        ])
    ]);
};
