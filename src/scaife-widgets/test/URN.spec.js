/* global describe, expect, it  */
import URN from '../urn';

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
const asUrn = urns.map(urn => new URN(urn));

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
    const urn = 'gurn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1-3';
    expect(new URN(urn).ancestors()).toEqual([]);
  });

  it('parses a subrange without any ancestor nodes correctly', () => {
    const urn = 'gurn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-3.5';
    const expected = [
      new URN('gurn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1'),
      new URN('gurn:cts:greekLit:tlg0012.tlg001.perseus-grc2:2'),
      new URN('gurn:cts:greekLit:tlg0012.tlg001.perseus-grc2:3'),
    ];
    expect(new URN(urn).ancestors()).toEqual(expected);
  });

  it.each([
    [urns[0], []],
    [urns[1], []],
    [urns[2], [asUrn[1]]],
    [urns[3], [asUrn[1], asUrn[2]]],
    [urns[4], [asUrn[1], asUrn[2]]],
    [urns[5], [asUrn[1], asUrn[2], asUrn[3]]],
    [urns[6], [asUrn[1], asUrn[2], asUrn[3], asUrn[5]]],
    [
      urns[7],
      [asUrn[1], asUrn[2], asUrn[3], asUrn[5], asUrn[8], asUrn[9], asUrn[10]],
    ],
  ])('parses the ancestor URN tree correctly at any depth', (urn, result) => {
    expect(new URN(urn).ancestors()).toEqual(result);
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
