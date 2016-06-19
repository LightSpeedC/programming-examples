
<script>
try {
var win = nw.Window.get();

var rootMenu = new nw.Menu({
	type: 'menubar'});
var myMenu = new nw.Menu();

myMenu.append(new nw.MenuItem({
	type: 'normal',
	label: 'Debug',
	click: function (){
		win.showDevTools();
	} }));

rootMenu.append(new nw.MenuItem({
	label: 'NW-Reveal',
	submenu: myMenu
}));

rootMenu.append(new nw.MenuItem({
	label: 'NW-Reveal',
	submenu: myMenu
}));

} catch(e) {
	alert(e.stack);
}
</script>
<br/>

<script>
if (!global.count) global.count = 0;
if (Function('return this')() === window) document.writeln('window<br/>');
</script>
