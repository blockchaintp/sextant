#!groovy

// Copyright 2018 Intel Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ------------------------------------------------------------------------------

// Discard old builds after 31 days
properties([[$class: 'BuildDiscarderProperty', strategy:
        [$class: 'LogRotator', artifactDaysToKeepStr: '',
        artifactNumToKeepStr: '', daysToKeepStr: '31', numToKeepStr: '']]]);

node ('master') {
    timestamps {
        // Create a unique workspace so Jenkins doesn't reuse an existing one
        ws("workspace/${env.BUILD_TAG}") {
            stage("Clone Repo") {
                checkout scm
            }

            // Set the ISOLATION_ID environment variable for the whole pipeline
	    if ( env.ISOLATION_ID ) {
		echo 'Using ISOLATION_ID=$ISOLATION_ID'
	    } else {
            	env.ISOLATION_ID = sh(returnStdout: true, script: 'printf $BUILD_TAG | sed -e \'s/\\//-/g\'| sha256sum | cut -c1-64').trim()
	    }
            env.COMPOSE_PROJECT_NAME = sh(returnStdout: true, script: 'printf $BUILD_TAG | sed -e \'s/\\//-/g\'|sha256sum | cut -c1-64').trim()

 	    stage("Clean All Previous Images") {
		sh "build/clean_images ${ISOLATION_ID}"
	    } 
			
            // Build 
            stage("Build Sextant") {
              sh "docker-compose -f docker-compose.yaml build"
            }

            // Run the tests

	    // Build docks

	    // Push Docker images
	    stage("Tag Push images") {
		sh "docker login -u $DOCKER_USER --password=$DOCKER_PASSWD"
		sh "build/tag_and_push_images ${ISOLATION_ID} ${ORGANIZATION} ${VERSION}"	
	    } 

	    stage("Cleanup") {
		sh "build/clean_images ${ISOLATION_ID}"
	    } 

	    // Archive Build artifacts
        }
    }
}
