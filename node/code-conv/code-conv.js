// code-conv.js
// 文字コード変換

// @ts-check
'use strict';

const mapSj2Uni = createMap(require('./code-conv-sjis-uni.json'));
const mapUni2Sj = createMap(require('./code-conv-uni-sjisnaiji-nkf.json'));

//######################################################################
// load map
function createMap(codePairList) {
  if (typeof codePairList !== 'object' || !(codePairList instanceof Array))
    throw new Error('code pair list must be an array');

  if (codePairList.length <= 0)
    throw new Error('code pair list must not be empty');

  if (codePairList[codePairList.length - 1] !== (codePairList.length - 1) / 2)
    throw new Error('end of code pair list must be length');

  const map = {};

  for (let i = 0, n = codePairList.length; i < n; i += 2)
    map[codePairList[i]] = codePairList[i + 1];

  return map;
}


//######################################################################
/**
 * class CodeConv:
 * method convSj2Uni(buffSj, function (err, uni) {})
 * method strUni = convSj2UniSync(buffSj)
 * method buffSj = convUni2SjSync(strUni or buffUni)
 */
function CodeConv() {
}


//######################################################################
// method strUni = convSj2UniSync(buffSj)
function convSj2UniSync(buffSj) {
  if (typeof buffSj !== 'object' || !(buffSj instanceof Buffer))
    throw new Error('buffSj must be a buffer');

  let strUni = '';

  for (let i = 0, n = buffSj.length; i < n;) {
    const c1 = buffSj[i++];
    if (c1 <= 0x80 || c1 >= 0xFD) {
      strUni += String.fromCharCode(c1);
      continue;
    }
    if (c1 >= 0xA0 && c1 <= 0xDF) {
      const c10 = mapSj2Uni[c1];
      if (c10) strUni += String.fromCharCode(c10);
      else strUni += '?';
      continue;
    }
    if (i >= n) break;
    const c2 = buffSj[i++];
    const c = (c1 << 8) | c2;
    const c0 = mapSj2Uni[c];
    if (c0) strUni += String.fromCharCode(c0);
    else strUni += '■';
  }
  return strUni;
}
CodeConv.convSj2UniSync = convSj2UniSync;


//######################################################################
// method buffSj = convUni2SjSync(strUni)
function convUni2SjSync(strUni) {
  if (typeof strUni === 'object' && strUni instanceof Buffer)
    strUni = strUni.toString();

  if (typeof strUni !== 'string')
    throw new Error('strUni must be a buffer or string');

  const listSj = [];

  for (let i = 0, n = strUni.length; i < n; ++i) {
    const c1 = strUni.charCodeAt(i);

    // ASCII JIS Roman 半角ASCII/JIS Roman
    if (c1 <= 0x7F) {
      listSj.push(c1);
      continue;
    }

    // JIS Hankaku Katakana 半角ｶﾀｶﾅ
    if (c1 >= 0xFF61 && c1 <= 0xFF9F) {
      const c10 = mapUni2Sj[c1];
      if (c10) listSj.push(c10);
      else listSj.push(0x3F); // ?
      continue;
    }

    // JIS Zenkaku Kanji 全角漢字
    const c10 = mapUni2Sj[c1];
    if (!c10) {
      listSj.push(0x81); // ■
      listSj.push(0xA1); // ■
      continue;
    }

    const c10h = c10 >>> 8;
    if (c10h > 0)
      listSj.push(c10h);
    listSj.push(c10 & 0xFF);
  }
  return Buffer.from(listSj);
}
CodeConv.convUni2SjSync = convUni2SjSync;


//######################################################################
// method strUni = convAny2UniSync(buffAny)
function convAny2UniSync(buffAny) {
  const strUniFromSj = convSj2UniSync(buffAny);
  const strUniFromUni = buffAny.toString();

  if (strUniFromSj.length < strUniFromUni.length)
    return strUniFromSj;
  else
    return strUniFromUni;
}
CodeConv.convAny2UniSync = convAny2UniSync;

CodeConv.CodeConv = CodeConv;
module.exports = CodeConv;
