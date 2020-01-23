const Web3 = require( 'web3' )

const system_provider = 'https://rinkeby.infura.io/v3/78bf7bf684434eff9eb7604d50c80ae1'
const web3 = new Web3(system_provider)

const acc1 = web3.eth.accounts.create('klsdnvkndsiovnsnvpoksk;spd')

console.log(acc1)