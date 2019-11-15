export default class URN {
  constructor(urn) {
    this.absolute = urn;
    this.delimiter = ':';
    this.scheme = null;
    this.nid = null;
    this.nss = null;
    this.work = null;
    this.reference = null;
    this.version = null;
    this.nodes = [];
    this.node = null;
    this.destructure();
  }

  destructure() {
    const split = this.absolute.split(this.delimiter);
    [this.scheme, this.nid, this.nss, this.work, this.reference] = split;
    // TODO: Should have the trailing ':', see elsewhere.
    this.version = `${this.scheme}:${this.nid}:${this.nss}:${this.work}`;
    this.nodes = this.splitReference();
    this.node = this.nodes[this.nodes.length - 1];
  }

  isRange() {
    return this.reference.includes('-');
  }

  splitReference() {
    if (this.isRange()) {
      const [hierarchy, endRange] = this.reference.split('-');
      const until = endRange.includes('.') ? endRange.split('.')[1] : endRange;
      const nodes = hierarchy.split('.');
      nodes[nodes.length - 1] = `${nodes[nodes.length - 1]}-${until}`;
      return nodes;
    }
    return this.reference.split('.');
  }

  ancestors() {
    const nodes = this.nodes.slice(0, -1);
    const ancestors = [];
    let last = null;
    nodes.forEach((node) => {
      if (!last) {
        last = `${this.version}:${node}`;
      } else {
        last = `${last}.${node}`;
      }
      ancestors.push(new this.constructor(last));
    });
    return ancestors;
  }
}
