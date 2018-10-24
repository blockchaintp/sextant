/*

  split a string into an array ready for a command or args
  field for a k8s pod

  anything between quotes stays as one chunk then split based on space

  so this:

    bash -c "echo hello"

  becomes:

    ['bash', '-c', '"echo hello"']
  
*/
const splitCommand = (string) => {
  if(!string) return []
  return string
    .match(/"(?:\\"|\\\\|[^"])*"|\S+/g)
    .map(s => s.replace(/^"/, ''))
    .map(s => s.replace(/"$/, ''))
}

const utils = {
  splitCommand,
}

export default utils