  function sum(n) {
    if (n <= 0) return 0;
    return n + sum(n - 1);
  }

  function calcSum(n) {
    console.log('sum', n, '=', sum(n));
  }

  calcSum(10);
  calcSum(100);
  calcSum(1000);
  calcSum(10000);
  calcSum(100000);
