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
This service implements a few simple APIs:

1. `/publications` - return all publications from the embedded database (really an object)
2. `/publications/:id` - return a specific publication by its id.  Note `id` is an integer.  For example `/publications/1`
3. `/publications/:id/locations` - same as returning a publication by its `id`, but the payload is enriched with location data that is returned from a second service.  For example `/publications/1/location`

By default this server is configured to run on `localhost:8080` and through kubernetes via a nodeport on `http://192.168.99.100:30501`.  Run `minikube ip` to get the correct IP address.  You can adjust the external port in the `deploy.yml` file

### Notes
Note that if you want to avoid using an enterprise registry you can look elsewhere for directions.  If you want to deploy to `minikube` directly from a local container be sure that you execute `eval $(minikube docker-env)` and then build the docker container as the container must be visible to minikube.  Google if you need to understand this more.  Also, dont forget that the configuration can be altered through the `config.json` file in the root of the `\src` directory.

### Structures
The following outlines the data structures returned from this service.  For getting all of the publications or a publication by ID the following data structure is returned.  This is an example of `publications/2`: 

```javascript
{
    id: 2,
    code: "JSC07",
    title: "On the Automatic Modularization of Software Systems Using the Bunch Tool",
    cite: "B. S. Mitchell, S. Mancoridis In the IEEE Transactions on Software ...",
    link: "pubs/TSE-0035-0304.pdf",
    slides: null,
    abstract: "Since modern software systems are large ...",
}
```
For getting a publication wiht additional location information the following data structure is returned.  This is an example of `publications/2/location` - notice the inclusion of the `location_details` attribute that is returned from the second microservice:
 
```javascript
{
    id: 2,
    code: "JSC07",
    title: "On the Automatic Modularization of Software Systems Using the Bunch Tool",
    cite: "B. S. Mitchell, S. Mancoridis In the IEEE Transactions on Software ...",
    link: "pubs/TSE-0035-0304.pdf",
    slides: null,
    abstract: "Since modern software systems are large ...",
    location_details: {
        key: "JSC07",
        type: "JOURNAL",
        url: "https://link.springer.com/article/10.1007/s00500-007-0218-3"
    }
}
```