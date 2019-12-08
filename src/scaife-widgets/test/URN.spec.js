/* global describe, expect, it  */
import { URN } from '@scaife-viewer/scaife-widgets';

const urns = [
  'urn:cts:greekLit:tlg0012.tlg001.msA:',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.300-400',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4.5-4.6',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4.5-7.8',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.5',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.6',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.7',
];

describe('URN.js', () => {
  it.each([
    ['urn:cts:greekLit:tlg0012.tlg001.msA:', null],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.1-1.7', null],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.1-5.7', null],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3', null],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4.5-4.6', null],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4.5-7.8', null],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.2.300-400', '300-400'],
  ])('matches inclusive-range patterns via regex', (pattern, expected) => {
    const result = new URN(pattern).inclusiveRangeRe.exec(pattern);
    expect(result ? result[0] : result).toEqual(expected);
  });

  it.each([
    ['urn:cts:greekLit:tlg0012.tlg001.msA:', null],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.1-1.7', '1.1-1.7'],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.1-5.7', '1.1-5.7'],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3', null],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4.5-4.6', '4.5-4.6'],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4.5-7.8', '4.5-7.8'],
    ['urn:cts:greekLit:tlg0012.tlg001.msA:1.2.300-400', null],
  ])('matches sub-range patterns via regex', (pattern, expected) => {
    const result = new URN(pattern).subRangeRe.exec(pattern);
    expect(result ? result[0] : result).toEqual(expected);
  });

  it('parses an inclusive range without any ancestor nodes correctly', () => {
    const urn = 'urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1-3';
    expect(new URN(urn).hierarchy).toEqual([]);
  });

  it('parses the ancestor nodes of a subrange correctly', () => {
    const urn = 'urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-3.5';
    expect(new URN(urn).hierarchy).toEqual(['1', '2', '3']);
  });

  it.each([
    [urns[0], []],
    [urns[1], []],
    [urns[2], ['1']],
    [urns[3], ['1', '2']],
    [urns[4], ['1', '2']],
    [urns[5], ['1', '2', '3']],
    [urns[6], ['1', '2', '3', '4']],
    [urns[7], ['1', '2', '3', '4', '5', '6', '7']],
  ])('parses the ancestor URN tree correctly at any depth', (urn, result) => {
    expect(new URN(urn).hierarchy).toEqual(result);
  });

  it.each([
    [urns[0], false],
    [urns[1], '1'],
    [urns[2], '2'],
    [urns[3], '3'],
    [urns[4], false],
    [urns[5], '4'],
    [urns[6], false],
    [urns[7], false],
  ])('parses the URN node correctly excluding ranges', (urn, result) => {
    expect(new URN(urn).node).toEqual(result);
  });
});
