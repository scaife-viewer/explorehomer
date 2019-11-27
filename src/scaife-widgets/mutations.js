import { SET_TEXT_SIZE, SET_TEXT_WIDTH } from './constants';

export default {
  [SET_TEXT_SIZE]: (state, size) => {
    state.readerTextSize = size;
  },
  [SET_TEXT_WIDTH]: (state, width) => {
    state.readerTextWidth = width;
  },
};
