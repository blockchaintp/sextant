// if the cluster is currently in this state then kubectl can be used
const kubectlReadyPhases = {
  created: true,
  deployed: true,
}

// if an error happened at the following state then kubectl can be used
const kubectlErrorPhaseReadyPhases = {

  // an error in the deploy means we can still use kubectl
  deploy: true,

  // an error in the undeploy means we can still use kubectl
  undeploy: true,
}

// is the cluster in a state where we have access to kubectl?
const kubectlReady = (status) => {
  if(kubectlReadyPhases[status.phase]) return true
  if(status.errorPhase && kubectlErrorPhaseReadyPhases[status.errorPhase]) return true
  return false
}

const utils = {
  kubectlReady
}

export default utils