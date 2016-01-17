// http://qiita.com/butchi_y/items/59d45e8212643b43cba4
//for(i=0;++i<16;console.log(i%5?x||i:x+'Buzz'))x=i%3?'':'Fizz'
//f=i=>i%100?0:console.log(i,f(++i));f(1)

i=0;while(i<30)for(n=810092048;n;n>>=2)console.log([++i,'Fizz','Buzz','FizzBuzz'][n&3])
process.exit()


for(i=0;++i<16;)console.log(['Fizz','',''][i%3]+['Buzz','','','',''][i%5]||i)
process.exit()

console.log(0b100100100100100) // 18724
console.log(0b100001000010000) // 16912
console.log(0b110000010010010000011000010000) // 810092048

