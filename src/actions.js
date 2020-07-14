import gql from 'graphql-tag';

import client from '@/gql';
import {
  FETCH_METADATA,
  UPDATE_METADATA,
  FETCH_LIBRARY,
  SET_PASSAGE,
  SET_DISPLAY_MODE,
  SELECT_NAMED_ENTITIES,
  CLEAR_NAMED_ENTITIES,
  PLAY_AUDIO,
  STOP_AUDIO,
  SELECT_LINE,
} from '@/constants';

export default {
  [SELECT_LINE]: ({ commit }, { ref }) => {
    commit(SELECT_LINE, ref);
  },
  [STOP_AUDIO]: ({ commit }) => {
    commit(STOP_AUDIO);
  },
  [PLAY_AUDIO]: ({ commit }, { ref }) => {
    commit(PLAY_AUDIO, ref);
  },
  [SELECT_NAMED_ENTITIES]: ({ commit }, { entities }) => {
    commit(SELECT_NAMED_ENTITIES, entities);
  },
  [CLEAR_NAMED_ENTITIES]: ({ commit }) => {
    commit(CLEAR_NAMED_ENTITIES);
  },
  [SET_DISPLAY_MODE]: ({ commit }, { mode }) => {
    commit(SET_DISPLAY_MODE, mode);
  },
  [FETCH_METADATA]: ({ commit }) => {
    client
      .query({
        query: gql`
          {
            versions(first: 1) {
              edges {
                node {
                  metadata
                }
              }
            }
          }
        `,
      })
      .then(data =>
        commit(
          FETCH_METADATA,
          data.data.versions.edges.map(e => e.node.metadata).pop(),
          { root: true },
        ),
      );
  },
  [UPDATE_METADATA]: ({ commit }, { urn }) => {
    client
      .query({
        query: gql`
          {
            versions(urn: "${urn}") {
              edges {
                node {
                  metadata
                }
              }
            }
          }
        `,
      })
      .then(data =>
        commit(
          FETCH_METADATA,
          data.data.versions.edges.map(e => e.node.metadata).pop(),
          { root: true },
        ),
      );
  },
  // @@@ should this really be something within scaife-widgets?
  [FETCH_LIBRARY]: ({ commit }) => {
    client
      .query({
        query: gql`
          {
            tree(urn: "urn:cts:", upTo: "version") {
              tree
            }
          }
        `,
      })
      .then(data => {
        const nid = data.data.tree.tree[0];
        const textGroupsTree = nid.children.reduce((a, b) => {
          return a.concat(b.children);
        }, []);
        commit(FETCH_LIBRARY, textGroupsTree, { root: true });
      });
  },
  [SET_PASSAGE]: ({ commit }, { urn }) => commit(SET_PASSAGE, urn),
};
