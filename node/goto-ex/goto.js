// see also https://gist.github.com/shibukawa/315765020c34f4543665

var target;

target: for (;;) switch (target) {

  case undefined:
    console.log('init');

  case 'start':
    console.log('start');

    // goto next;
    target = 'next';
    continue target;

  case 'skip':
    console.log('skip');

  case 'next':
    console.log('next');

  default:
    break target;

}

console.log('exit');
