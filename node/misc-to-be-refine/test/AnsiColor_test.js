// ANSI COLOR{カラー}

'use strict';

var c = '\u001B[';
function p2(n) { return n < 10 ? ' ' + n : n; }
var s = '     ';
for (var n = 30; n < 38; ++n) s += p2(n) + '     ';
for (var n = 40; n < 48; ++n) s += p2(n) + '     ';
console.log(s);

for (var i = 0; i < 10; ++i)
  for (var j = 0; j < 10; ++j) {
    var k = i * 10 + j;
    if (k >= 8 && k < 30 || k >= 50 && k < 90) continue;
    var s = p2(k);
    for (var n = 30; n < 38; ++n)
      s += ' '+c+'97;'+n+'m'+ c+k+'mA'+c+'1mB'+c+'5mC'+c+'21mD'+c+'25mE'+c+'mF';
    for (var n = 40; n < 48; ++n)
      s += ' '+c+'97;'+n+'m'+ c+k+'mA'+c+'1mB'+c+'5mC'+c+'21mD'+c+'25mE'+c+'mF';
    console.log(s);
}
var s = '     ';
for (var n = 30; n < 38; ++n) s += p2(n) + '     ';
for (var n = 40; n < 48; ++n) s += p2(n) + '     ';
console.log(s);

/*
0 NORMAL
1 BOLD
2 UNBOLD
4 underline
5 GRAY (REVERSED DARK GRAY)

21 UNBOLD
22 UNBOLD
25 UNGRAY

30 BLACK
31 DARK RED
32 DARK GREEN
33 DARK YELLOW
34 DARK BLUE
35 DARK MAGENTA
36 DARK CYAN
37 DARK WHITE / GRAY

40 REVERSE BLACK
41 REVERSE DARK RED
42 REVERSE DARK GREEN
43 REVERSE DARK YELLOW
44 REVERSE DARK BLUE
45 REVERSE DARK MAGENTA
46 REVERSE DARK CYAN
47 REVERSE DARK WHITE / GRAY

90 DARK GRAY
91 RED
92 GREEN
93 YELLOW
94 BLUE
95 MAGENTA
96 CYAN
97 WHITE
*/
