m.startComputation();
m.endComputation();

m.redraw(true);

m.prop();

m('tag', {attrs: 'value'}, []);


m("br"); //yields a virtual element that represents <br>
m("div", "Hello"); //yields <div>Hello</div>
m("div", {class: "container"}, "Hello"); //yields <div class="container">Hello</div>

m.render(document.body, m("br")); //puts a <br> in <body>
