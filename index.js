const express = require('express');
const call = require("./helper/listenEvent.js");
const logic = require("./helper/logic")
const app = express();
var bodyParser = require('body-parser')
const cors = require('cors');

const port = 4040;
const IPFS_CID = process.env.IPFS_CID || "bafybeiegcntjpzmltlyekmik2tdipzqwcdxofa3rkifguebmz2ylcfypta"


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));

let flowJSON;

async function tell(event) {
    let nodeid;
    let node;
    let params = [];
    for (let i of flowJSON.nodes) {
        if (i.type == "events/listen") {
            if (i.properties.evalue == event.event) {
                nodeid = i.id
                node = i
            }
        }
        console.log(event)


    }
    let arraykey = Object.keys(event.returnValues)
    for (let a of node.outputs) {
        if (arraykey.includes(a.name)) {
            params.push(event.returnValues[a.name]);
        }



    }
    console.log(params);
    logic.parseflow(flowJSON, nodeid, params);
}

let starter = async () => {
    try {
        flowJSON = await (await fetch(`https://cloudflare-ipfs.com/ipfs/${IPFS_CID}/flow.json`)).json()
        let contractmap = {}
        for (let i of flowJSON.nodes) {

            if (i.type == "events/listen") {
                if (!contractmap[i.properties.cvalue]) {
                    contractmap[i.properties.cvalue] = [i.properties.evalue]
                }
                else {
                    contractmap[i.properties.cvalue].push([i.properties.evalue])


                }
            }


        }
        let abc = await call.handlecontracts(contractmap, tell);

    }
    catch (err) {
        console.log(err)

    }
};



app.get('/getabiview', async (req, res) => {
    try {
        console.log(req.query.contractadd)
        let abi = await call.getabiview(req.query.contractadd);
        console.log('here')
        res.send({ status: true, abi: abi })
    }
    catch (err) {
        res.send({ status: false })

    }
});




app.get('/contract', async (req, res) => {
    try {
        console.log(req.query)
        let abi = await call.getabi(req.query.contractadd);
        if (abi) {
            res.send({ status: true, abi: abi })
        } else {
            res.send({ status: false })
        }
    }

    catch (err) {
        console.log(err);
        res.send({ status: false });
    }
})







app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    starter()


});



