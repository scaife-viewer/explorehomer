# Explore Homer

front-end for the Scaife "Explore Homer" prototype

This repository is part of the [Scaife Viewer](https://scaife-viewer.org) project, an open-source ecosystem for building rich online reading environments.

## Prerequisites
- [Node.js 12](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/en/docs/install)
- [vue-cli](https://cli.vuejs.org/guide/installation.html)

## Install project
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

**NOTE: Project initialization**

The following command was used to set up the initial project; it does not need to be ran again, but is provided here for reference on future projects:
```shell
vue create explorehomer -d
```

### Routing to a local ATLAS server.
If you want to run an ATLAS server on your local machine then you can route all
requests to that address by overriding the graphql endpoint, like so:
```
export VUE_APP_ATLAS_GRAPHQL_ENDPOINT=http://localhost:8000/graphql/
```

### Deploying to QA instances
PRs against `develop` will automatically be deployed to Netlify to a one-off
URL, a ["deploy preview"](https://docs.netlify.com/site-deploys/overview/#definitions).

We can take advantage of [Netlify's deploy contexts](https://docs.netlify.com/configure-builds/file-based-configuration/#deploy-contexts) to override environment variables for these deploy previews.

For example, we can override deploys of a deploy preview of the `feature/ci-cd` branch to
point to an alternate ATLAS instance:

```toml
[context."feature/ci-cd".environment]
  VUE_APP_ATLAS_GRAPHQL_ENDPOINT = "https://explorehomer-atlas.herokuapp.com/graphql/"
```
