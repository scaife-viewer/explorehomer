import { URN } from '@scaife-viewer/scaife-widgets';
import {
  DISPLAY_MODE_SENTENCE_ALIGNMENTS,
  DISPLAY_MODE_FOLIO,
  DISPLAY_MODE_INTERLINEAR,
  DISPLAY_MODE_METRICAL,
  DISPLAY_MODE_NAMED_ENTITIES,
  DISPLAY_MODE_DEFAULT,
} from '@/constants';

import AlignmentsModeReader from '@/reader/components/AlignmentsModeReader.vue';
import ImageModeReader from '@/reader/components/ImageModeReader.vue';
// eslint-disable-next-line max-len
import NamedEntitiesModeReader from '@/reader/components/NamedEntitiesModeReader.vue';
import MetricalModeReader from '@/reader/components/MetricalModeReader.vue';
// eslint-disable-next-line max-len
import InterlinearModeReader from '@/reader/components/InterlinearModeReader.vue';
import DefaultModeReader from '@/reader/components/DefaultModeReader.vue';

const READER_COMPONENTS = {
  [DISPLAY_MODE_SENTENCE_ALIGNMENTS]: AlignmentsModeReader,
  [DISPLAY_MODE_FOLIO]: ImageModeReader,
  [DISPLAY_MODE_NAMED_ENTITIES]: NamedEntitiesModeReader,
  [DISPLAY_MODE_METRICAL]: MetricalModeReader,
  [DISPLAY_MODE_INTERLINEAR]: InterlinearModeReader,
  [DISPLAY_MODE_DEFAULT]: DefaultModeReader,
};

export default {
  metadata: state => state.metadata,
  passage: state => (state.passage ? new URN(state.passage) : null),
  firstPassageUrn: state =>
    state.metadata ? new URN(state.metadata.firstPassageUrn) : null,
  workTitle: state => (state.metadata ? state.metadata.workTitle : ''),
  libraryTree: state => state.libraryTree,

  readerComponent: state => {
    return READER_COMPONENTS[state.displayMode];
  },
  alignmentsMode: state => {
    return state.displayMode === DISPLAY_MODE_SENTENCE_ALIGNMENTS;
  },
  folioMode: state => {
    return state.displayMode === DISPLAY_MODE_FOLIO;
  },
  interlinearMode: state => {
    return state.displayMode === DISPLAY_MODE_INTERLINEAR;
  },
  metricalMode: state => {
    return state.displayMode === DISPLAY_MODE_METRICAL;
  },
  namedEntitiesMode: state => {
    return state.displayMode === DISPLAY_MODE_NAMED_ENTITIES;
  },
  defaultMode: state => {
    return state.displayMode === DISPLAY_MODE_DEFAULT;
  },
  urn: (state, getters) => {
    const { urn } = state.route.query;
    return urn ? new URN(urn) : getters.firstPassageUrn;
  },
};
