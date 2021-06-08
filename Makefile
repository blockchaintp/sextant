MAKEFILE_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(MAKEFILE_DIR)/standard_defs.mk

PMD_IMAGE ?= blockchaintp/pmd:latest

.PHONY: all clean build test test_pmd archive dirs analyze analyze_sonar

all: clean build test archive

build:  $(MARKERS)/build_docker

analyze: analyze_cpd analyze_sonar_js

clean: clean_container

distclean: clean_docker

dirs: dirs_test

.PHONY: dirs_test
dirs_test:
	mkdir -p test

$(MARKERS)/build_docker:
	docker-compose -f docker-compose.yaml build

.PHONY: analyze_cpd
analyze_cpd:
	docker run -v $$(pwd)/src:/src $(PMD_IMAGE) cpd --minimum-tokens 100 \
		--failOnViolation false \
		--files /src --language ecmascript --format xml \
		--skip-lexical-errors > build/cpd.xml

.PHONY: clean_container
clean_container:
	docker-compose -f docker-compose.yaml rm -f || true

.PHONY: clean_docker
clean_docker:
	docker-compose -f docker-compose.yaml down -v --rmi all || true
