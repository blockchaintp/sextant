import randomstring from 'randomstring'

const rbacSecretKey = () => randomstring.generate({
  length: 20,
  charset: 'alphabetic'
})

const rbacAesKey = () => randomstring.generate({
  length: 32,
  charset: 'hex'
})

const rbacBatcherKey = () => randomstring.generate({
  length: 64,
  charset: 'hex'
})

const randomValues = {
  rbacSecretKey,
  rbacAesKey,
  rbacBatcherKey,
}

export default randomValues