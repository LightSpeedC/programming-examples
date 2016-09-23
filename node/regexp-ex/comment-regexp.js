'w // xx \r\nx/* aaa\r\n bbb */ y /* xxx */zz/*****/ z '.replace(new RegExp('/\\*([^*]|\\*[^/])*\\*/|//.*', 'g'), '')

