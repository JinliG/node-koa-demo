function getNthFibonacciSequence(n: number) {
  if (n < 0) {
    console.error('索引值错误');
  }

  if (n === 0) {
    return 0;
  } else if (n === 1) {
    return 1;
  }

  let f0 = 0;
  let f1 = 1;
  let f2 = 0;

  for(let i = 2; i <= n; i++) {
    f2 = f0 + f1;
    f0 = f1;
    f1 = f2;
  }

  return f2;
}