MAKEFILE_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(MAKEFILE_DIR)/standard_defs.mk

PMD_IMAGE ?= blockchaintp/pmd:latest

.PHONY: all clean build test test_pmd archive dirs analyze analyze_sonar

all: clean build test archive

build:  $(MARKERS)/build_docker

test: $(MARKERS)/test_npm

analyze: analyze_fossa analyze_sonar_js

clean: clean_container clean_npm

distclean: clean_docker

dirs: dirs_test

.PHONY: dirs_test
dirs_test:
	mkdir -p test

$(MARKERS)/build_docker:
	docker-compose -f docker-compose.yaml build
	touch $@

.PHONY: clean_container
clean_container:
	docker-compose -f docker-compose.yaml rm -f || true

.PHONY: clean_docker
clean_docker:
	docker-compose -f docker-compose.yaml down -v --rmi all || true

.PHONY: clean_npm
clean_npm:
	rm -rf node_modules
