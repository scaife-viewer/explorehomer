import cloneDeep from 'lodash.clonedeep';
import VueRouter from 'vue-router';

import routes from '../../../routes';

const mockRouterComponents = (cloned) => {
  cloned.forEach((route) => {
    // eslint-disable-next-line no-param-reassign
    route.component = { template: '<p>Stubbed</p>' };
    if (route.children && route.children.length) {
      // eslint-disable-next-line no-param-reassign
      route.children = mockRouterComponents(route.children);
    }
  });
  return cloned;
};

export default {
  mock() {
    return new VueRouter({
      mode: 'abstract',
      routes: mockRouterComponents(cloneDeep(routes)),
    });
  },
};
