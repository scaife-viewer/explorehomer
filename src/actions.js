import gql from 'graphql-tag';

import { gqlclient } from '@/gql';
import {
  FETCH_METADATA,
  UPDATE_METADATA,
  FETCH_LIBRARY,
  SET_PASSAGE,
} from '@/constants';

export default {
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
      .then(data => commit(FETCH_LIBRARY, data.data.tree.tree, { root: true }));
  },
  [SET_PASSAGE]: ({ commit }, { urn }) => commit(SET_PASSAGE, urn),
};
