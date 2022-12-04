const { Contract } = require('ethers');
const { main } = require('../router_protocol/routerprotocol');

const provider = require('./listenEvent');
const pushhelper = require('../push_protocol/index').sendNotification
const routerhelper = require('../router_protocol/routerprotocol').main;





function create_query(id) {
    query_gql = JSON.stringify({
        query: `{
        liquidityPool(id: ${id}){
         
          totalValueLockedUSD
        }
      }`,
    });
    return query_gql;
}



functionmap = {
    "math/condition": async (node) => {
        return math(node)
    },
    "basic/const": async (output) => {
        return output
    }


}





function math(node) {
    let a = node.inputsfinal[0].finalval
    let b = node.inputsfinal[1].finalval
    let abc = math_it_up[node.properties.OP](a, b);


    node.outputs.forEach((i) => {

        if (abc.toString() == i["name"]) {
            node.finaloutput = i;
            node.finaloutput.finalval = node.finaloutput.name;

        }
    })


}


function basic(node) {
    node.finaloutput = node.outputs[0];
    node.finaloutput.finalval = node.properties["value"];
}



function eventsem(node) {
    node.finaloutput = node.outputs
    //compute the output please;
    for (i in node.finaloutput) {
        node.finaloutput.finalval = node
    }
}

//maps links with whose output the links are

let mapoutput = {};

//maps the value of links 
let linksval = {};

//maps links with whose input the links are
let mapinput = {};

//maps node with there output
let mapnodewithoutput = {};

//maps not with there input;
let mapnodewithinput = {};

//maps all the links that have been recursed;
let maprecursed = {};


let parse = async (nodelist) => {

    for (var i of nodelist.nodes) {
        if (i.outputs) {
            for (var j of i.outputs) {
                if (j.links) {
                    for (let k of j.links) {

                        mapoutput[k] = i.id;


                    }
                }
            }
        }
        if (i.inputs) {
            for (var j of i.inputs) {
                if (j.link) {

                    mapinput[j.link] = i.id;


                }
            }

        }


        if (i.inputs) {
            for (var j of i.inputs) {
                if (j.link) {
                    if (mapnodewithinput[i.id]) {
                        mapnodewithinput[i.id].push(j.link);

                    }
                    else {
                        mapnodewithinput[i.id] = [j.link];
                    }

                }
            }


        }
        if (i.outputs) {
            for (var j of i.outputs) {
                if (j.links) {
                    if (mapnodewithoutput[i.id]) {

                        mapnodewithoutput[i.id].push(j.links);

                    } else {
                        mapnodewithoutput[i.id] = []
                        mapnodewithoutput[i.id].push((j.links));
                    }


                }
            }
        }


       
    }





}
var sortednodes = []
let sort = async (nodlist) => {

    for (i of nodlist.nodes) {
        sortednodes[i.id] = i
    }

    nodelist = sortednodes;
}







let recursion = async (node) => {
    console.log("the node id is" + node.id)
    if (node.type == "math/condition") {
        console.log("math/condition")
        console.log(node.id)

        let inputs = mapnodewithinput[node.id];

        for (i of inputs) {
            if (!linksval[i]) {

                if (!maprecursed[i]) {

                    maprecursed[i] = true;
                    console.log("the mapoutput is " + mapoutput[i])
                    await recursion(nodelist[mapoutput[i]])
                }
            }
        }
        let val = math_it_up[node.properties.OP](linksval[mapnodewithinput[node.id][0]], linksval[mapnodewithinput[node.id][1]]);
        console.log(linksval[mapnodewithinput[node.id][0]], linksval[mapnodewithinput[node.id][1]], node.properties.OP)
        if (val == true) {
            if (node.outputs[0].links) {
                for (let i of node.outputs[0].links) {

                    linksval[i] = true;
                    await recursion(nodelist[mapinput[i]]);
                }
            }
        }
        else {
            if (node.outputs[0].links) {
                for (let i of node.outputs[1].links) {

                    linksval[i] = false;
                    await recursion(nodelist[mapinput[i]]);
                }
            }
        }




        console.log(val);

    }
    else if (node.type == "notifications/push_protocol") {

        let inputs = mapnodewithinput[node.id]
        for (i of inputs) {
            if (!linksval[i]) {

                if (!maprecursed[i]) {

                    maprecursed[i] = true;
                    console.log("the mapoutput is " + mapoutput[i])
                    await recursion(nodelist[mapoutput[i]])
                }
            }
        }

        let recepient = linksval[inputs[1]]
        let channel = linksval[inputs[2]]
        let title = linksval[inputs[3]]
        let body = linksval[inputs[4]]

        pushhelper(title, body, recepient, channel);





    }
    else if (node.type == "events/listen") {
        console.log("on events/listen")
        let a = event_val;
        let iterator = 0;
        for (i of node.outputs) {

            if (node.outputs[iterator].links) {



                if (node.outputs[iterator].links) {

                    for (j of node.outputs[iterator].links) {

                        linksval[j] = a[iterator];


                    }
                }
            }
            iterator++;


        }

        for (let i of mapnodewithoutput[node.id]) {
            for (let j of i) {
                if (!maprecursed[j]) {
                    await recursion(nodelist[mapinput[j]]);
                }
            }
        }
        return
    }

    else if (node.type == "basic/const") {
        console.log("basic/const")
        if (node.outputs[0].links) {
            for (i of node.outputs[0].links) {

                linksval[i] = node.properties.value;
            }
            return;
        }


    }
    else if (node.type == "basic/console") {
        if (node.output[0].links) {
            for (i of node.outputs[0].links) {

                linksval[i] = node.properties.value;
            }
        }
        return;
    }

    else if (node.type == "basic/string") {
        console.log("basic/string")
        if (node.outputs[0].links) {
            for (i of node.outputs[0].links) {

                linksval[i] = node.properties.value;
            }
        }
        return;

    }


    else if (node.type == "contract/View Function") {
        console.log("contract/View Function")
        let inputs = mapnodewithinput[node.id];
        let outputs = mapnodewithoutput[node.id];


        for (i of inputs) {
            if (!linksval[i]) {

                if (!maprecursed[i]) {

                    maprecursed[i] = true;
                    console.log("the mapoutput is " + mapoutput[i])
                    await recursion(nodelist[mapoutput[i]])
                }
            }
        }
        let parameter = [];
        for (let i of inputs) {

            parameter.push(linksval[i])
        }

        let abi = await provider.getabi(node.properties.cvalue);
        let contract = new provider.providers.eth.Contract(abi, node.properties.cvalue)
        let result = await contract.methods[node.properties.evalue](...parameter.slice(1, parameter.length)).call()
        console.log("this is the view function" + result.toString())
        for (i of outputs) {
            linksval[i] = result;
        }

        for (let i of node.outputs) {
            if (i.links) {
                for (let j of i.links) {

                    await recursion(nodelist[mapinput[j]]);
                }
            }
        }





    }

    else if (node.type == "contract/crosschain_swap") {
        console.log("contract/crosschain_swap")
        let inputs = mapnodewithinput[node.id];
        let outputs = mapnodewithoutput[node.id];
        for (i of inputs) {
            if (!linksval[i]) {

                if (!maprecursed[i]) {

                    maprecursed[i] = true;
                    console.log("the mapoutput is " + mapoutput[i])
                    await recursion(nodelist[mapoutput[i]])
                }
            }
        }

        let val = await main(node.properties.fromChain, node.properties.toChain, linksval[inputs[1]], linksval[inputs[2]], linksval[inputs[3]], linksval[inputs[4]]);
        if (val == true) {
            if (node.outputs[0].links) {
                for (let i of node.outputs[0].links) {

                    linksval[i] = true;
                    await recursion(nodelist[mapinput[i]]);
                }
            }
        }
        else {
            if (node.outputs[0].links) {
                for (let i of node.outputs[1].links) {

                    linksval[i] = false;
                    await recursion(nodelist[mapinput[i]]);
                }
            }
        }

    }


    else if (node.type == "theGraph/Uniswap Liqudity") {
        console.log("contract/Uniswap Liqudity")
        let inputs = mapnodewithinput[node.id];
        let outputs = mapnodewithoutput[node.id];
        for (i of inputs) {
            if (!linksval[i]) {

                if (!maprecursed[i]) {

                    maprecursed[i] = true;
                    console.log("the mapoutput is " + mapoutput[i])
                    await recursion(nodelist[mapoutput[i]])
                }
            }
        }
        let id = linksval[inputs[1]];
        const query = `{\n  liquidityPool(id:\"${id}\"){\n    id\n    totalValueLockedUSD\n  }\n}`
        let ans = await fetch('https://gateway.thegraph.com/api/ca477456f6867aa73e24582c464e4e5f/deployments/id/QmcPHxcC2ZN7m79XfYZ77YmF4t9UCErv87a9NFKrSLWKtJ', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                query: query
            })
        })
        ans = await ans.json()
        if (node.outputs[0].links) {
            for (let i of node.outputs[0].links) {

                linksval[outputs[0]] = ans.data.liquidityPool.totalValueLockedUSD
                await recursion(nodelist[mapinput[i]]);
            }
        }



    }




}












let math_it_up = {
    ">": function (x, y) { return x > y },
    "<": function (x, y) { return x < y },
    "==": function (x, y) { return x == y },
    "!=": function (x, y) { return x != y },
    "<=": function (x, y) { return x <= y },
    ">=": function (x, y) { return x >= y },
    "||": function (x, y) { return x || y },
    "&&": function (x, y) { return x && y }
};


let event_val;



var nodelist;

/*
let abc =
{
    "last_node_id": 7,
    "last_link_id": 9,
    "nodes": [
        {
            "id": 5,
            "type": "math/condition",
            "pos": [730, 316],
            "size": [80, 60],
            "flags": {},
            "order": 3,
            "mode": 0,
            "inputs": [
                { "name": "A", "type": "number", "link": 6 },
                { "name": "B", "type": "number", "link": 7 }
            ],
            "outputs": [
                { "name": "true", "type": "boolean", "links": null },
                { "name": "false", "type": "boolean", "links": null }
            ],
            "properties": { "A": 1, "B": 1, "OP": ">" }
        },
        {
            "id": 4,
            "type": "basic/const",
            "pos": [385, 515],
            "size": [180, 30],
            "flags": {},
            "order": 0,
            "mode": 0,
            "outputs": [
                {
                    "name": "value",
                    "type": "number",
                    "links": [7],
                    "label": "100.000",
                    "slot_index": 0
                }
            ],
            "properties": { "value": 100 }
        },
        {
            "id": 6,
            "type": "math/condition",
            "pos": [807, 598],
            "size": [80, 60],
            "flags": {},
            "order": 4,
            "mode": 0,
            "inputs": [
                { "name": "A", "type": "number", "link": 8 },
                { "name": "B", "type": "number", "link": 9 }
            ],
            "outputs": [
                { "name": "true", "type": "boolean", "links": null },
                { "name": "false", "type": "boolean", "links": null }
            ],
            "properties": { "A": 1, "B": 1, "OP": "==" }
        },
        {
            "id": 7,
            "type": "basic/const",
            "pos": [454, 660],
            "size": [180, 30],
            "flags": {},
            "order": 2,
            "mode": 0,
            "outputs": [
                {
                    "name": "value",
                    "type": "number",
                    "links": [9],
                    "label": "20.000",
                    "slot_index": 0
                }
            ],
            "properties": { "value": 20 }
        },
        {
            "id": 1,
            "type": "events/listen",
            "pos": [122, 277],
            "size": [500, 120],
            "flags": {},
            "order": 1,
            "mode": 0,
            "outputs": [
                { "name": "dst", "type": "string", "links": null, "slot_index": 0 },
                { "name": "wad", "type": "number", "links": [6, 8], "slot_index": 1 }
            ],
            "properties": {
                "cvalue": "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
                "evalue": "Deposit",
                "color": "blue"
            }
        }
    ],
    "links": [
        [6, 1, 1, 5, 0, "number"],
        [7, 4, 0, 5, 1, "number"],
        [8, 1, 1, 6, 0, "number"],
        [9, 7, 0, 6, 1, "number"]
    ],
    "groups": [],
    "config": {},
    "extra": {},
    "version": 0.4
}
 
*/
let clear = () => {
    mapoutput = {}

    linksval = {};

    //maps links with whose input the links are
    mapinput = {};

    //maps node with there output
    mapnodewithoutput = {};

    //maps not with there input;
    mapnodewithinput = {};

    //maps all the links that have been recursed;
    maprecursed = {};

}



exports.parseflow = async (flowjson, nodeid, paramsArray) => {
    clear()
    await parse(flowjson)
    let abc = await sort(flowjson)
    event_val = paramsArray;
    console.log("the event is" + event_val)
    await recursion(nodelist[nodeid]);


    console.log(linksval)
}

