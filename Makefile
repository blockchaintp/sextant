export ISOLATION_ID ?= local
PWD = $(shell pwd)

REPO ?= $(shell git remote show -n origin | grep Fetch | awk -F'[/.]' '{print $$3}' )
BRANCH_NAME ?= $(shell git symbolic-ref -q HEAD )
VERSION ?= $(shell git describe --dirty)

UID := $(shell id -u)
GID := $(shell id -g)

PMD_IMAGE = blockchaintp/pmd:latest

.PHONY: all clean build test test_pmd archive dirs

all: clean build test archive

dirs:
	mkdir -p build

build:
	docker-compose -f docker-compose.yaml build

test: test_pmd

test_pmd: dirs
	# At the moment this is failing due to some incompatibility
	# docker run -v $$(pwd)/src:/src $(PMD_IMAGE) pmd \
	#	-R /usr/local/rulesets/ecmascript/btp_basic.xml \
	#	-d /src -f xml -min 1 \
	#	-V \
	#	--failOnViolation false \
	#	-l ecmascript | sed -e 's@name=\"/src@name=\"src@'> build/pmd.xml
	docker run -v $(pwd)/src:/src $(PMD_IMAGE) cpd --minimum-tokens 100 \
		--failOnViolation false \
		--files /src --language ecmascript --format xml > build/cpd.xml

clean:
	docker-compose -f docker-compose.yaml rm -f || true
	docker-compose -f docker-compose.yaml down -v --rmi all || true
	rm -rf build

archive: dirs
	git archive HEAD --format=zip -9 --output=build/$(REPO)-$(VERSION).zip
	git archive HEAD --format=tgz -9 --output=build/$(REPO)-$(VERSION).tgz
