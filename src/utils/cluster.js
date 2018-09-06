const readyPhases = {
  created: true,
  deployed: true,
}

// is the cluster in a state where we have access to kubectl?
const kubectlReady = (phase) => readyPhases[phase] ? true : false

const utils = {
  kubectlReady
}

export default utils