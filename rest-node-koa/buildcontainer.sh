#!/bin/bash
npm run build
docker build -t architecting-software/node-pubs-service .