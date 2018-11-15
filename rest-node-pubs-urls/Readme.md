# A Simple WebService to Demo Kubernetes (K8s) Functions

### Introduction

The purpose of this project is to build a simple lightweight web service using  [nodejs](https://nodejs.org/en/) and the [koa](https://koajs.com/) frameworks.

### Key Commands

1. `npm run watch-server` - best command to use for development.  Uses nodemon and node-ts to run the code from typescript directly and to monitor changes.
2. `npn run build` - this command compiles the typescript code and produces output in the `./dist' directory
3. `npm run start-docker` not to be executed directly, but this command runs the `app.js` file from a location that was specified in the Dockerfile
4. `buildcontainer.sh` shell script to build a docker container
5. `kubectl create -f ./k8s/deploy.yml` - this command deploys the docker container to kubernetes and creates a service.  By default it creates a NodePort service that is accessible on port 3051.  Note that this YAML file is really configured for a local kubernetes installation, and has been tested with [minikube](https://kubernetes.io/docs/setup/minikube/).  I would expect that the `deploy.yml` file would need to be adjusted to deploy to other kubernetes clusters (EKS, OpenShift, etc)

### Ways to Call the Service
This service implements a single API:

`/url/:id` - return a specific location detail by its id.  Note `id` is an integer.  For example `/url/GECCO02`.  The returned structure looks like this:

```javascript
{
    key: "GECCO02",
    type: "CONFERENCE",
    url: "http://www.sigevo.org/gecco-2002/"
}
```

By default this server is configured to run on `localhost:8090` and through kubernetes via a nodeport on `http://192.168.99.100:30502`.  Run `minikube ip` to get the correct IP address.  You can adjust the external port in the `deploy.yml` file

### Notes
Note that if you want to avoid using an enterprise registry you can look elsewhere for directions.  If you want to deploy to `minikube` directly from a local container be sure that you execute `eval $(minikube docker-env)` and then build the docker container as the container must be visible to minikube.  Google if you need to understand this more.  Also, dont forget that the configuration can be altered through the `config.json` file in the root of the `\src` directory.