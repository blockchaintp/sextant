export ISOLATION_ID ?= local
PWD = $(shell pwd)

ORGANIZATION ?= $(shell git remote show -n origin | grep Fetch | \
												awk '{print $$NF}' | \
												sed -e 's/git@github.com://' | \
												sed -e 's@https://github.com/@@' | \
												awk -F'[/.]' '{print $$1}' )
REPO ?= $(shell git remote show -n origin | grep Fetch | \
												awk '{print $$NF}' | \
												sed -e 's/git@github.com://' | \
												sed -e 's@https://github.com/@@' | \
												awk -F'[/.]' '{print $$2}' )

BRANCH_NAME ?= $(shell git symbolic-ref -q HEAD )
SAFE_BRANCH_NAME ?= $(shell git symbolic-ref -q HEAD|sed -e 's@refs/heads/@@'|sed -e 's@/@_@g' )
VERSION ?= $(shell git describe --dirty)

UID := $(shell id -u)
GID := $(shell id -g)

SONAR_HOST_URL ?= https://sonarqube.dev.catenasys.com
SONAR_AUTH_TOKEN ?= $(SONAR_AUTH_TOKEN)
PMD_IMAGE ?= blockchaintp/pmd:latest

.PHONY: all clean build test test_pmd archive dirs analyze analyze_sonar

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
	docker run -v $$(pwd)/src:/src $(PMD_IMAGE) cpd --minimum-tokens 100 \
		--failOnViolation false \
		--files /src --language ecmascript --format xml \
		--skip-lexical-errors > build/cpd.xml

analyze: analyze_sonar

analyze_sonar:
	[ -z "$(SONAR_AUTH_TOKEN)" ] || \
	docker run \
		--rm \
		-v $$(pwd):/usr/src \
		sonarsource/sonar-scanner-cli \
			-Dsonar.projectKey=$(ORGANIZATION)_$(REPO):$(SAFE_BRANCH_NAME) \
			-Dsonar.projectName=$(REPO) \
			-Dsonar.projectVersion=$(VERSION) \
			-Dsonar.host.url=$(SONAR_HOST_URL) \
			-Dsonar.login=$(SONAR_AUTH_TOKEN)

clean:
	docker-compose -f docker-compose.yaml rm -f || true
	docker-compose -f docker-compose.yaml down -v --rmi all || true
	rm -rf build

archive: dirs
	git archive HEAD --format=zip -9 --output=build/$(REPO)-$(VERSION).zip
	git archive HEAD --format=tgz -9 --output=build/$(REPO)-$(VERSION).tgz
