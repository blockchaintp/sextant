
pipeline {
    agent any
    stages {
	stage("Clone Repo") {
	    steps {
		def scmVars = checkout scm

	    }
	    environment {
		VERSION=sh(returnStdout: true, script: 'get describe |cut -c 2-').trim()
		GIT_URL=scm.GIT_URL
		ORGANIZATION=sh(returnStdout: true, script: 'basename `dirname $GIT_URL`').trim()
	    }

	    when { not expression { return env.ISOLATION_ID } } 
	    environment {
		ISOLATION_ID = sh(returnStdout: true, script: 'printf $BUILD_TAG | sed -e \'s/\\//-/g\'| sha256sum | cut -c1-64').trim()
	    }


	}
 	stage("Clean All Previous Images") {
	    steps {
		sh "build/clean_images ${ISOLATION_ID}"
	    }
	} 
	
	// Build 
	stage("Build Sextant") {
	    steps {
		sh "docker-compose -f docker-compose.yaml build"
	    }
	}
	
	// Run the tests
	
	// Build docs
	
	// Push Docker images
	stage("Tag Push images") {
	    steps {
		withCredentials([usernamePassword(credentialsId: 'dockerHubID', usernameVariable: 'DOCKER_USER',passwordVariable: 'DOCKER_PASSWD')]) {
		    sh "docker login -u $DOCKER_USER --password=$DOCKER_PASSWD"
		    sh "build/tag_and_push_images ${ISOLATION_ID} ${ORGANIZATION} ${VERSION}"	
		}
	    }
	} 
	
	// Archive Build artifacts
	
	

	
    }
    // Post Pipeline Cleanup    
    post {
	always {
	    sh "build/clean_images ${ISOLATION_ID}"
	}
    }	  	
    
}
