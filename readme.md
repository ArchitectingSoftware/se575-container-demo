# Demo Project to Illustrate Docker and Kubernetes

I am using this project as a demonstration in my Graduate Software Design course at Drexel University (SE575).

### Introduction
The purpose of this project is to demonstrate the power of a simple project that uses Docker and Kubernetes.  It consists of 2 web services that are both exposed via Kubernetes directly, but they also work together.  Specifically the `rest-node-koa` service calls the `rest-node-pubs-urls` service. Both directories have all of the working code and have `readme.md` files that include directions on how to deploy and run.

### Instructions
Because these are node projects, after cloning this repo you will need to run `npm install` on both of the sub-projects before you can run them.  Again, each one has their own `readme.md` to show how you can run outside of Docker and Kubernetes, as well as the process to dockerize each project and deploy to Kubernetes. You will also need to have Docker and a Kubernetes based system like MiniKube installed. 

### Architecture
The following picture shows the overall architecture.  Thanks [monodraw](https://monodraw.helftone.com/) - way cool.

```text
     ┌───────────────────┐                                                
     │    Kubernetes     │                                                
    ┌┴───────────────────┴───────────────────────────────────────────────┐
    │    ┌───────┐                                                       │
    │ ┌──┤ Pod 1 ├───────────────┐                                       │
    │ │  └───────┘               │                                       │
    │ │                          │                                       │
    │ │ ┌───────────────────────┐│  ┌────┐    ┌───────┐                  │
 .  │ │ │███████████████████████││  │k8s │  ┌─┤ Pod 2 ├────────────────┐ │
( )─┼─┤ │███┌───────────────┐███││  │DNS │  │ └───────┘                │ │
 '  │ │ │███│ Pubs Service  │███│├──┴─┬──┘  │┌───────────────────────┐ │ │
    │ │ │███└───────────────┘███││    │     ││███████████████████████│ │ │
    │ │ │███████████████████████││    └─────┤│██┌──────────────────┐█│ │ │
    │ │ └───────────────────────┘│          ││██│ Pubs URL Service │█│ │ │
    │ └──────────────────────────┘          ││██└──────────────────┘█│ │ │
 .  │                                       ││███████████████████████│ │ │
( )─┼───────────────────────────────────────┤└───────────────────────┘ │ │
 '  │                                       └──────────────────────────┘ │
    └────────────────────────────────────────────────────────────────────┘
```

### Other Considerations
This is not meant to be a full production template.  For example, I set the containers to run as non-root users, but for production systems like OpenShift the containers need to be configured to run as a random non-root UID.  If you are interested to see how this works take a look at the `rest-node-koa/Dockerfile-Full` file.