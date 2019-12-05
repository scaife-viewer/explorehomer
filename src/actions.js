import gql from 'graphql-tag';

import { gqlclient } from './gql';
import { FETCH_METADATA } from './constants';

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
};
