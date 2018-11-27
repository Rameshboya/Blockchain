//*- DEBUG UTIL CONSTS --//
const LOAN_OWNER_ADDRESS = '0xda14bf14bb95ba90082815223fe96e9cd7d1d217';
const BUYER_ADDRESS = '0x69407440479968c122b49131f84aa1f7067749cb';

let USE_BUYER_ADDRESS = false;
const DEFAULT_CALLBACK = (...data) => { console.info(JSON.stringify(data)); };
//*/ // End of debug utils

//Constants:
const abiJson = '[{"constant":false,"inputs":[{"name":"_token","type":"uint64"},{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"token","type":"uint64"},{"name":"mintedAmount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"uint64"},{"name":"tokenOwner","type":"address"}],"name":"register","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_token","type":"uint64"},{"name":"_value","type":"uint256"},{"name":"blockheight","type":"uint64"},{"name":"approval","type":"bytes32"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"token","type":"uint64"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"token","type":"uint64"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint64"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint64"}],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"message","type":"string"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"signer","type":"address"}],"name":"verifyString","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"}]';
let abi = JSON.parse(abiJson);

const CONTRACT_ADDRESS = '0xea16fd309363086a7490e3468a0cad3f278e72ef';

let contract, contractInstance;
/* //Connect directly to local instance
const NOT_METAMASK = true;
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
contract = CreditChainContract(web3);
/*/
const NOT_METAMASK = false;
window.addEventListener('load', function () {

    // Check if Web3 has been injected by the browser:
    if (typeof web3 !== 'undefined') {

        // You have a web3 browser! Continue below!
        contract = LeedsCoinContract(web3);

    } else {

        // Warn the user that they need to get a web3 browser
        // Or install MetaMask, maybe with a nice graphic.
        console.error(`No instance of MetaMask is detected!`);
    }

})

function LeedsCoinContract(web3Inst) {
    contract = web3Inst.eth.contract(abi);
    contractInstance = contract.at(CONTRACT_ADDRESS);

    //Generic callback creator
    const genCallback = (funcName, callback) => {
        return (err, ...data) => {
            if (err) {
                console.error('[ERROR][:${funcName}]', err);
                callback(err);
            } else {
                console.log(`[:${funcName}] Success`);
                callback(null, data);
            }
        }
    };

    return {
        getBalance: function (token, callback) {
            web3.eth.getAccounts((e, accounts) => {
                return contractInstance.balanceOf(
                    accounts[0], token,
                    { from: accounts[0], gas: 99999 },
                    genCallback('balanceOf', (err, response) => {
                        if (err != null) {
                            callback(err);
                        } else {
                            callback(null, response[0].c[0]);
                        };
                    })
                );
            });
        },


        transfer: function (to, token, value, callback) {
            web3.eth.getAccounts((e, accounts) => {
                return contractInstance.transfer(
                    to, token, value, 0, [0],
                    { from: accounts[0], gas: 99999 },
                    genCallback('transfer', (err, response) => {
                        if (err != null) {
                            callback(err);
                        } else {
                            console.log(response);
                            callback(null, response);
                        };
                    })
                );
            });
        },


        mint: function (to, token, value, callback) {
            web3.eth.getAccounts((e, accounts) => {
                return contractInstance.mint(
                    to, token, value,
                    { from: accounts[0], gas: 99999 },
                    genCallback('mint', (err, response) => {
                        if (err != null) {
                            callback(err);
                        } else {
                            console.log(response);
                            callback(null, response);
                        };
                    })
                );
            });
        },
    };
}
//*/