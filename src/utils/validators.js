const RESERVED_TP_NAMES = {
  'smallbank-tp': true,
  'settings-tp': true,
  'identity-tp': true,
  'block-info-tp': true,
  'poet-validator-registry-tp': true,
  'smallbank-tp': true,
  'rbac-tp': true,
  'xo-tp': true,
  'xo-demo': true,
  'simple-tp-python': true,
  'rest-api': true,
}

const required = value => (value ? undefined : 'Required')
const maxLength = (max, countType = 'characters') => value =>
  value && value.length > max ? `Must be ${max} or less ${countType}` : undefined
const minLength = (min, countType = 'characters') => value =>
  value && value.length < min ? `Must be ${min} or more ${countType}` : undefined
const number = value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined
const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined
const maxValue = max => value =>
  value && value > max ? `Must not be more than ${max}` : undefined
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined
const password => value => 
  value && !/^(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/.test(value)
    ? 'Password must be at least 8 characters long and contain at least two uppercase characters, at least three lowercase characters and at least 2 numbers'
    : undefined
const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined
const alphaNumericNoSpaces = value =>
  value && /[^a-zA-Z0-9-_]/i.test(value)
    ? 'Only alphanumeric characters, dashes or underscores'
    : undefined
const phone = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined
const numeric = value => isNaN(parseFloat(value)) ? 'Must be a numeric value' : undefined
const integer = value => value % 1 != 0 ? 'Must be an integer' : undefined
const unsigned = value => value < 0 ? 'Must be a positive value' : undefined

const domain = value =>
  value && /[^a-zA-Z0-9\.-]/i.test(value)
    ? 'Only alphanumeric characters, dashes or full stops'
    : undefined

const networkname = value =>
  value && /[^a-zA-Z0-9]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined

const cidr = value =>
  value && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{2}$/i.test(value)
    ? undefined
    : 'Invalid CIDR range (e.g. 172.20.0.0/16)'

const publicKey = value => 
  value && !/^ssh-rsa AAAA/.test(value)
    ? 'Must be an RSA public key'
    : undefined

const rbac_secret_key = value => 
  value && /^[a-zA-Z0-9]{20}$/i.test(value)
    ? undefined
    : 'Must be a 20 character alphanumeric value'
  
const rbac_aes_key = value => 
  value && /^[0-9a-fA-F]{32}$/i.test(value)
    ? undefined
    : 'Must be a 32 character hexadecimal value'

const rbac_batcher_key = value => 
  value && /^[0-9a-fA-F]{64}$/i.test(value)
    ? undefined
    : 'Must be a 64 character hexadecimal value'

const custom_tp_name = value => {
  if(!value) return undefined
  if(RESERVED_TP_NAMES[value]) return `${value} is a reserved name`
  if(!value.match(/^[\w-]+$/)) return 'Only alphanumeric characters'
  return undefined
}

const custom_tp_image = value => {
  if(!value) return undefined
  if(!value.match(/^[\w\/]+(:\w+)?$/)) return 'Invalid image format'
  return undefined
}

const seedAddress = value => {  
  if(!value) return undefined
  if(!value.match(/^[\w\.]+:\d+$/)) return 'Bad seed address, must be of form hostname:port or ip:port'
  const [ host, port ] = value.split(':')
  if(host.match(/^[\.\d]+$/) && !host.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) return 'Bad seed ip address, must be of form 1.2.3.4'
  return undefined
}

const wrapper = (validators) => (value, allValues, props) => {
  // return the first of any errors
  return validators
    .map(validator => validator(value, allValues, props))
    .filter(v => v)[0]
}

// wrap an array of other validators that will only apply if there is a value to check
// useful for if you want a field that is validated only if a value is entered
const optionalWrapper = (validators) => (value, allValues, props) => {
  if(typeof(value) === 'undefined') return undefined
  return wrapper(validators)(value, allValues, props)
}

const cluster = {
  all: (values) => {
    const errors = {}
    if(values.master_zones.length != values.master_count) {
      errors.master_zones = `The number of master zones must equal the number of masters (${values.master_count})`
    }
    if(values.node_count < 3) {
      errors.node_count = `The number of nodes must be greater than or equal to 3`
    }
    if(values.node_zones.length < 3) {
      errors.node_zones = `The number of node zones must be greater than or equal to 3`
    }
    if(values.node_zones.length > values.node_count) {
      errors.node_zones = `Must be ${values.node_count} or less zones`
    }
    const networkCidrMask = parseInt(values.network_cidr.split('/')[1])
    if(values.subnet_mask <= networkCidrMask) {
      errors.subnet_mask = `The subnet mask cannot be less than or equal to the overal network mask`
    }
    return errors
  },
  name: wrapper([
    required,
    domain,
  ]),
  node_count: wrapper([
    required,
    numeric,
    integer,
    unsigned,
    minValue(2),
    maxValue(128),
  ]),
  master_zones: wrapper([
    required,
    minLength(1, 'items'),
    // need max length based on master count
  ]),
  node_zones: wrapper([
    required,
    minLength(1, 'items'),
    // need max length based on worker count
  ]),
  network_cidr: wrapper([
    required,
    cidr,
  ]),
  subnet_mask: wrapper([
    required,
    integer,
    minValue(1),
    maxValue(32),
  ]),
  public_key: wrapper([
    required,
    publicKey
  ]),
}

const deployment = {
  all: (values) => {
    const errors = {}
    return errors
  },
  name: wrapper([
    required,
    networkname,
  ]),
  rbac_secret_key: wrapper([
    required,
    rbac_secret_key,
  ]),
  rbac_aes_key: wrapper([
    required,
    rbac_aes_key,
  ]),
  rbac_batcher_key: wrapper([
    required,
    rbac_batcher_key,
  ]),
}

const user = {
  allNew: (values) => {
    const errors = {}
    return errors
  },
  allExisting: (values) => {
    const errors = {}
    return errors
  },
  username: wrapper([
    required,
    minLength(2),
    alphaNumericNoSpaces,
  ]),
  optionalPassword: optionalWrapper([
    required,
    password,
  ]),
  requiredPassword: wrapper([
    required,
    password,
  ]),
}

const validators = {
  required,
  maxLength,
  minLength,
  number,
  minValue,
  maxValue,
  email,
  alphaNumeric,
  alphaNumericNoSpaces,
  phone,
  numeric,
  integer,
  domain,
  publicKey,
  seedAddress,
  unsigned,
  wrapper,
  optionalWrapper,
  cluster,
  deployment,
  user,
  custom_tp_name,
  custom_tp_image,
}

module.exports = validators