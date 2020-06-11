import gql from 'graphql-tag';

import { gqlclient } from '@/gql';
import {
  FETCH_METADATA,
  UPDATE_METADATA,
  FETCH_LIBRARY,
  SET_PASSAGE,
  SET_DISPLAY_MODE_METRICAL,
  SET_DISPLAY_MODE_INTERLINEAR,
  SET_DISPLAY_MODE_NAMED_ENTITIES,
  SET_DISPLAY_MODE_FOLIO,
  SET_DISPLAY_MODE_SENTENCE_ALIGNMENTS,
  SET_DISPLAY_MODE_DEFAULT,
  SELECT_NAMED_ENTITIES,
  CLEAR_NAMED_ENTITIES,
} from '@/constants';

export default {
  [SELECT_NAMED_ENTITIES]: ({ commit }, { entities }) => {
    commit(SELECT_NAMED_ENTITIES, entities);
  },
  [CLEAR_NAMED_ENTITIES]: ({ commit }) => {
    commit(CLEAR_NAMED_ENTITIES);
  },
  [SET_DISPLAY_MODE_NAMED_ENTITIES]: ({ commit }) => {
    commit(SET_DISPLAY_MODE_NAMED_ENTITIES);
  },
  [SET_DISPLAY_MODE_METRICAL]: ({ commit }) => {
    commit(SET_DISPLAY_MODE_METRICAL);
  },
  [SET_DISPLAY_MODE_SENTENCE_ALIGNMENTS]: ({ commit }) => {
    commit(SET_DISPLAY_MODE_SENTENCE_ALIGNMENTS);
  },
  [SET_DISPLAY_MODE_FOLIO]: ({ commit }) => {
    commit(SET_DISPLAY_MODE_FOLIO);
  },
  [SET_DISPLAY_MODE_DEFAULT]: ({ commit }) => {
    commit(SET_DISPLAY_MODE_DEFAULT);
  },
  [SET_DISPLAY_MODE_INTERLINEAR]: ({ commit }) => {
    commit(SET_DISPLAY_MODE_INTERLINEAR);
  },
  [FETCH_METADATA]: ({ commit }) => {
    gqlclient
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
    gqlclient
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
    gqlclient
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
