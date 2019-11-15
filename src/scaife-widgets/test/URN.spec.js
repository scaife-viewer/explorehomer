/* global describe, expect, it  */
import URN from '../urn';

const urns = [
  'urn:cts:greekLit:tlg0012.tlg001.msA:',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3-4',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4',
  'urn:cts:greekLit:tlg0012.tlg001.msA:1.2.3.4-3.5',
];
const asUrn = urns.map(urn => new URN(urn));

describe('URN.js', () => {
  it.each([
    [urns[0], []],
    [urns[1], []],
    [urns[2], [asUrn[1]]],
    [urns[3], [asUrn[1], asUrn[2]]],
    [urns[4], [asUrn[1], asUrn[2]]],
    [urns[5], [asUrn[1], asUrn[2], asUrn[3]]],
    [urns[6], [asUrn[1], asUrn[2], asUrn[3]]],
  ])('parses the ancestor tree correctly at any depth', (urn, result) => {
    expect(new URN(urn).ancestors()).toEqual(result);
  });

  it.each([
    [urns[0], ''],
    [urns[1], '1'],
    [urns[2], '2'],
    [urns[3], '3'],
    [urns[4], '3-4'],
    [urns[5], '4'],
    [urns[6], '4-5'],
  ])('parses the URN node correctly', (urn, result) => {
    expect(new URN(urn).node).toEqual(result);
  });
});
