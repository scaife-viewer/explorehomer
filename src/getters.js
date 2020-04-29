import URN from './urn';

export default {
  metadata: state => state.metadata,
  passage: state => (state.passage ? new URN(state.passage) : null),
  firstPassageUrn: state =>
    state.metadata ? new URN(state.metadata.firstPassageUrn) : null,
  workTitle: state => (state.metadata ? state.metadata.workTitle : ''),
  libraryTree: state => state.libraryTree,
};
