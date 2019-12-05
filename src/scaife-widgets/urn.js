export default class URN {
  constructor(urn) {
    this.absolute = urn;
    this.delimiter = ':';
    this.inclusiveRangeRe = /\d+-\d+$/;
    this.subRangeRe = /\d+\.\d+-\d+\.\d+$/;
    this.scheme = null;
    this.nid = null;
    this.nss = null;
    this.work = null;
    this.reference = null;
    this.version = null;
    this.hierarchy = null;
    this.node = false;
    this.range = false;
    this.destructureUrn();
  }

  expandRange() {
    const [start, stop] = this.range
      .split('-')
      .map(node => node.split('.')[0])
      .map(boundary => parseInt(boundary, 10));
    return [...Array(stop - start + 1)]
      .map((x, y) => y + start)
      .map(x => x.toString());
  }

  isNode() {
    return this.node !== false;
  }

  isRange() {
    return this.range !== false;
  }

  destructureUrn() {
    const split = this.absolute.split(this.delimiter);
    [this.scheme, this.nid, this.nss, this.work, this.reference] = split;
    this.version = `${this.scheme}:${this.nid}:${this.nss}:${this.work}:`;
    this.destructureReference();
  }

  destructureReference() {
    if (this.reference.includes('-')) {
      if (this.inclusiveRangeRe.exec(this.reference)) {
        // An inclusive range between macro boundaries.
        // Don't include the range values in the node hierarchy as they
        // shouldn't be considered ancestors of themselves or each other.
        // eg. 1.3-4
        const split = this.reference.split('.');
        this.range = split[split.length - 1];
        this.hierarchy = split.slice(0, -1);
      } else {
        // A subrange specifying points between macro boundaries.
        // In these cases, we do want to include the boundaries in the
        // hierarchy so that the subrange points are aware of their macro
        // ancestry. We also need to expand any intervals between the
        // top-level macro boundary values if the difference between them is
        // greater than one, in order have the complete set of ancestor URNs.
        // eg. 1.2.3-2.5', 1.2.4-5.6.
        const match = this.subRangeRe.exec(this.reference);
        if (!match) {
          throw new Error(`Malformed URN: ${this.absolute}`);
        }
        this.range = match.shift();
        const ancestors = this.reference
          .replace(`${this.range}`, '')
          .split('.')
          .filter(x => x !== '');
        const [start, end] = this.range
          .split('-')
          .map(node => node.split('.')[0]);
        this.hierarchy =
          start === end
            ? [...ancestors, start]
            : [...ancestors, ...this.expandRange()];
      }
    } else {
      this.hierarchy =
        this.reference.length > 1 ? this.reference.split('.').slice(0, -1) : [];
      this.node = this.reference
        ? this.reference
            .split('.')
            .slice(-1)
            .shift()
        : false;
    }
  }
}
