const { parseTransaction, id } = require('ethers/lib/utils');
var Web3 = require('web3')




let abimap = {};
const url_websocket = new Web3.providers.WebsocketProvider(process.env.PROVIDER_URL || "wss://burned-ancient-emerald.matic-testnet.discover.quiknode.pro/474dd43bf1bb07ae1338f80e36aab6a9e6753ac5/")
var web3 = new Web3(url_websocket)
const etherscanapikey = "5VCFTXJXHI38P9MEMQDR8TWYZHSUTZUHQ4"
let eventss;
eventbind = async (contract_address, evento, callback) => {
    try {
        let abi;
        
        if (!(contract_address in abimap)) {

            abi = await getabi(contract_address, web3)



        }
        else{
            abi = abimap[contract_address];
        }

        let contract = new web3.eth.Contract(JSON.parse(abi), contract_address)

        eventss = contract.events.allEvents(() => {
        }).on("connected", function (subscriptionId) {
            ('SubID: ', subscriptionId);
        })
            .on('data', function (event) {

                if (evento.includes(event.event)) {
                    console.log('Owner Wallet Address: ', event.returnValues.owner);
                    callback(event);
                }

                //Write send email process here!
            })
            .on('changed', function (event) {
                //Do something when it is removed from the database.
            })
            .on('error', function (error, receipt) {
                console.log('Error:', error, receipt);
            });;
            console.log("done everything")
            return;

    } catch (err) {
        console.log(err)

    }


}




exports.handlecontracts = async (contractmap, callback) => {
  if(eventss){
      eventss.unsubscripbe;
  }
    try {
       
        for (var i in contractmap) {
           
           await eventbind(i, contractmap[i], callback)
        }
    }
    catch (err) {
        console.log(err);
    }
    return

}







getabi = async (contract_address) => {
    try {
        const response = await fetch(`https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contract_address}&apikey=${etherscanapikey}`);
        let abi = await response.json()
        abimap[contract_address] = abi.result;
        return abi.result;
    } catch (err) {
        console.log(err);
    }

}



