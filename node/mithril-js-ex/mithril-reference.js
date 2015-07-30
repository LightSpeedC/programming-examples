m.startComputation();
m.endComputation();

m.redraw(true);

m.prop();

m('tag', {attrs: 'value'}, []);


// シンプル
m("br"); //yields a virtual element that represents <br>
m("div", "Hello"); //yields <div>Hello</div>
m("div", {class: "container"}, "Hello"); //yields <div class="container">Hello</div>


// DOMへの適用
m.render(document.body, m("br")); //puts a <br> in <body>


// CSS
m(".container"); //yields <div class="container"></div>
m("#layout"); //yields <div id="layout"></div>
m("a[name=top]"); //yields <a name="top"></a>
m("[contenteditable]"); //yields <div contenteditable></div>
m("a#google.external[href='http://google.com']", "Google"); //yields <a id="google" class="external" href="http://google.com">Google</a>


m("ul", [       // yields <ul>
    m("li", "item 1"), //   <li>item 1</li>
    m("li", "item 2"), //   <li>item 2</li>
]);                    // </ul>


//assume the variable `link` came from a web service
var link = {url: "http://google.com", title: "Google"}
m("a", {href: link.url}, link.title); //yields <a href="http://google.com">Google</a>


var links = [
    {title: "item 1", url: "/item1"},
    {title: "item 2", url: "/item2"},
    {title: "item 3", url: "/item3"}
];
m.render(document.body, [
    m("ul.nav",
        links.map(function(link) {
            return m("li",
                m("a", {href: link.url}, link.title) 
            );
        })
    ])
]);
// <body>
//     <ul class="nav">
//         <li><a href="/item1">item 1</a></li>
//         <li><a href="/item2">item 2</a></li>
//         <li><a href="/item3">item 3</a></li>
//     </ul>
// </body>


m("div", {class: "widget"});     //yields <div class="widget"></div>
m("div", {className: "widget"}); //yields <div class="widget"></div>
m("button", {onclick: alert});   //yields <button></button>, which alerts its event argument when clicked
//note this uses the Javascript syntax (uppercase "O") for `readonly`
//in order to set the boolean javascript property instead of the HTML attribute
m("input", {readOnly: true});  //yields <input readonly />
//using the HTML attribute name will call `setAttribute`, which may not be what you want
m("input", {readonly: false}); //yields <input readonly="false" />, which is still readonly


m("div", {style: {border: "1px solid red"}}); //yields <div style="border:1px solid red;"></div>


m("div", {style: {textAlign: "center"}}); //yields <div style="text-align:center;"></div>
m("div", {style: {cssFloat: "left"}});    //yields <div style="float:left;"></div>
//this does not work
m("div", {style: {"text-align": "center"}});
m("div", {style: {float: "left"}});


//note that we are not updating the value of the `name` getter-setter via an event handler
//redraws will always overwrite the current UI value with the value of `name()`
m("input", {value: name()})


//refactor the binding to a simple helper
var binds = function(prop) {
    return {oninput: m.withAttr("value", prop), value: prop()}
}
//a data store
var name = m.prop("")
//binding the data store in a view
m("input", binds(name))


m("div", "&times;") //becomes <div>&amp;times;</div>
m("div", m.trust("&times;")) //becomes <div>&times;</div>
