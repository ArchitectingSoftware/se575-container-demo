SHELL := /bin/bash

.PHONY: help
help:
	@echo "Usage: make <TARGET>"
	@echo ""
	@echo "Available targets are:"
	@echo ""
	@echo "    run-dev             		Run in development - typescript"
	@echo "    run-prod             	Run with compiled code"
	@echo ""

.PHONY: run-dev
run-dev:
	yarn watch-server

.PHONY: run-prod
run-prod:
	yarn build
	yarn start

.PHONY: build-container
build-container:
	yarn build
	docker build -t architecting-software/node-pubs-container .

.PHONY: run-container
run-container:
	docker run --rm -p 8080:8080 architecting-software/node-pubs-container

.PHONY: run-container-background
run-container-background:
	docker run --rm -d -p 8080:8080 architecting-software/node-pubs-container