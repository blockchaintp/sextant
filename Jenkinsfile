
pipeline {
    agent any
    stages {
	stage("Clone Repo") {
            checkout scm
	    sh 'env'
	}
	    
	// Set the ISOLATION_ID environment variable for the whole pipeline
	if ( env.ISOLATION_ID ) {
	    echo 'Using ISOLATION_ID=$ISOLATION_ID'
	} else {
            env.ISOLATION_ID = sh(returnStdout: true, script: 'printf $BUILD_TAG | sed -e \'s/\\//-/g\'| sha256sum | cut -c1-64').trim()
	}

	    
	env.VERSION=sh(returnStdout: true, script: 'get describe |cut -c 2-').trim()
	env.COMPOSE_PROJECT_NAME = sh(returnStdout: true, script: 'printf $BUILD_TAG | sed -e \'s/\\//-/g\'|sha256sum | cut -c1-64').trim()
	
 	stage("Clean All Previous Images") {
	    sh "build/clean_images ${ISOLATION_ID}"
	} 
	
	// Build 
	stage("Build Sextant") {
	    sh "docker-compose -f docker-compose.yaml build"
	}
	
	// Run the tests
	
	// Build docs
	
	// Push Docker images
	stage("Tag Push images") {
	    withCredentials([usernamePassword(credentialsId: 'dockerHubID', usernameVariable: 'DOCKER_USER',passwordVariable: 'DOCKER_PASSWD')]) {
		sh "docker login -u $DOCKER_USER --password=$DOCKER_PASSWD"
		sh "build/tag_and_push_images ${ISOLATION_ID} ${ORGANIZATION} ${VERSION}"	
	    }
	} 
	
	stage("Cleanup") {
	    sh "build/clean_images ${ISOLATION_ID}"
	} 
	
	// Archive Build artifacts
	
	
	// Post Pipeline Cleanup
	
    }
    
    post {
	always {
	    sh "build/clean_images ${ISOLATION_ID}"
	}
    }	  	
    
}
