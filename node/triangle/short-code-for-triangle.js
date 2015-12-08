//'use strict';
for(i=-3;i<4;++i)console.log('＊＊＊＊'.slice(Math.abs(i)));
for(i=-3;i<4;++i)document.write('＊＊＊＊'.slice(Math.abs(i))+'<br>');

/*
＊
＊＊
＊＊＊
＊＊＊＊
＊＊＊
＊＊
＊

見ないで考えたら以下のやつになった。

```js
for(i=-3;i<4;++i)document.write('＊＊＊＊'.slice(Math.abs(i))+'<br>')
```
でもまだ短いのがあるね。

```js
for(i=8;--i;)document.write('＊＊＊＊'.slice(Math.abs(i-4))+'<br>')
for(i=8;--i;)document.write('＊＊＊＊'.slice(' 3210123'[i])+'<br>')
```


考えた順に。

```js
for(i=-3;i<4;++i)document.write('＊＊＊＊'.slice(Math.abs(i))+'<br>')
for(i=7;i--;)document.write('＊＊＊＊'.slice(Math.abs(i-3))+'<br>')
for(i=7;i--;)document.write('＊＊＊＊'.slice('3210123'[i])+'<br>')
for(i=22;i--;)document.write(['<br>','＊']['1011011101111011101101'[i]])
for(i=22;i--;)document.write(['<br>','＊'][3006189..toString(2)[i]])
for(i=6012378;i>>=1;)document.write(['<br>','＊'][i&1])
```

後半は、もはや暗号。www

コンソールログで。
```js

parseInt('1011011101111011101101',2)
for(i=-3;i<4;++i)console.log('＊＊＊＊'.slice(Math.abs(i)))
for(i=8;--i;)console.log('＊＊＊＊'.slice(Math.abs(i-4)))
for(i=8;--i;)document.write('*'.repeat(i>4?8-i:i)+'<br>')
for(i=8;--i;)console.log('＊＊＊＊'.slice(' 3210123'[i]))
```




＊<br>
＊＊<br>
＊＊＊<br>
＊＊＊＊<br>
＊＊＊<br>
＊＊<br>
＊


 x
yxx
yxxx
yxxxx
yxxx
yxx
yx
y

for(i=23;--i;)console.log(['＊','<br>'][' 0100100010000100010010'[i]]);


parseInt('10100100010000100010010',2)
for(i=23;--i;)console.log(['＊','<br>'][5382418..toString(2)[i]])
1188114.toString(2)
for(


*/
