nw-readme
====

http://oldgeeksguide.github.io/presentations/html5devconf2013/wtod.html#/

```json
{
  "name": "My App",
  "main": "index.html",
  "window": {
    "resizable": true,
    "fullscreen": false,
    "width": 1000,
    "height": 600
  },
  "dependencies": {
  },
  "js-flags": "--harmony-collections"
}
```

File

```js
const fs = require('fs');

// Read a file:
let fileText = fs.readFileSync('package.json').toString();

// Write a file:
fs.writeFileSync('package.json.log', fileText);

// Explore a directory:
fs.readdirSync('.');
```

Choose

```html
<!-- Create non-displayed input element -->
<input onchange="openBrowsedFile(event)" id="chooser" type="file"
	style="display:none"/>

. . .
<script>
// Dispatch Click Event
var click = new CustomEvent('click');
var elem = document.getElementById('chooser');
elem.dispatchEvent(click);

// . . .

// Event contains chosen file name
function openBrowsedFile(event) {
	var filename = event.target.value;
    //    . . . 
}
</script>
```

CPU

```js]os = require('os');

// Number of CPU's
os.cpus().length

// Total CPU System Time
let time = os.cpus().map(x => x.times.sys).reduce((x,y) => x + y);

// Free memory
os.freemem();
```

Menu

```js
var gui = require('nw.gui');
var win = gui.Window.get();

var rootMenu = new gui.Menu({
	type: 'menubar'});
var myMenu = new gui.Menu();

myMenu.append(new gui.MenuItem({
	type: 'normal',
	label: 'Debug',
	click: function (){
		win.showDevTools();
	} }));

rootMenu.append(new gui.MenuItem({
	label: 'NW-Reveal',
	submenu: myMenu
}));

rootMenu.append(new gui.MenuItem({
	label: 'NW-Reveal',
	submenu: myMenu
}));
```

Tray

```js
var tray = new gui.Tray({
    icon: 'icon.png'
  });
var menu = new gui.Menu();
menu.append(new gui.MenuItem({
    type: 'checkbox',
    label: 'Always-on-top',
    click: function () {...}
  }));
tray.menu = menu;
```

Kiosk

```js
// In package.json
"window": {
    "kiosk": true
}

// Or
gui.Window.get().enterKioskMode();

// Later
gui.Window.get().leaveKioskMode();
```

Shell

```js
// Open Link in browser
gui.Shell.openExternal('https://intel.com');

// Open a file with default application
gui.Shell.openItem('foo.ext');

// Open a file in finder/file explorer.
gui.Shell.showItemInFolder('/path/to/bar');
```

Play

```js
var gui = require('nw.gui');
var win = gui.Window.get();

win.hide();
win.show();
win.maximize();
win.minimize();

window.open();
window.moveBy(10,30);
window.resizeTo(800,600);
```


