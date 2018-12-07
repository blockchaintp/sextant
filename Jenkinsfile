
pipeline {
    agent any	    
    options {
	timestamps()
    }

    ws("workspace/${env.BUILD_TAG}") {
	stage("Clone Repo") {
	    checkout scm
	    sh "git fetch --tag"
	}
	
	
	env.GIT_URL=echo scm.GIT_URL
	env.ISOLATION_ID = sh(returnStdout: true, script: 'printf $BUILD_TAG | sed -e \'s/\\//-/g\'| sha256sum | cut -c1-64').trim()
	env.ORGANIZATION=sh(returnStdout: true, script: 'basename `dirname $GIT_URL`').trim()
	env.VERSION=sh(returnStdout: true, script: 'git describe |cut -c 2-').trim()

	
	
	stage("Clean All Previous Images") {
	    steps {
		sh "docker rmi \$(docker images --filter reference='*:${ISOLATION_ID} --format '{{.Repository}}:{{.Tag}})"
		sh "docker rmi \$(docker images --filter reference='*/*:${ISOLATION_ID} --format '{{.Repository}}:{{.Tag}})"
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
	    sh "docker rmi \$(docker images --filter reference='*:${ISOLATION_ID} --format '{{.Repository}}:{{.Tag}})"
	    sh "docker rmi \$(docker images --filter reference='*/*:${ISOLATION_ID} --format '{{.Repository}}:{{.Tag}})"
	    
	}
    }
}

