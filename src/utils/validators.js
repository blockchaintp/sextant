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
const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
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

const cidr = value =>
  value && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{2}$/i.test(value)
    ? undefined
    : 'Invalid CIDR range (e.g. 172.20.0.0/16)'

const publicKey = value => 
  value && !/^ssh-rsa AAAA/.test(value)
    ? 'Must be an RSA public key'
    : undefined
  
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
    console.log('-------------------------------------------');
    console.dir(values)
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
  public_key: wrapper([
    required,
    publicKey
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
  phone,
  numeric,
  integer,
  domain,
  publicKey,
  unsigned,
  wrapper,
  optionalWrapper,
  cluster,
}

module.exports = validators