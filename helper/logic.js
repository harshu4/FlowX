var json = require('./sample.json');




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
        console.log(i)
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



let node = {
    "id": 2,
    "type": "math/condition",
    "pos": [1050, 148],
    "size": [80, 60],
    "flags": {},
    "order": 4,
    "mode": 0,
    "inputs": [
        { "name": "A", "type": "number", "link": 1 },
        { "name": "B", "type": "number", "link": 2 }
    ],
    "outputs": [
        { "name": "true", "type": "boolean", "links": [6], "slot_index": 0 },
        { "name": "false", "type": "boolean", "links": null, "slot_index": 1 }
    ],
    "inputsfinal": [
        { "name": "true", "type": "boolean", "links": [6], "slot_index": 0, "finalval": 500 },
        { "name": "false", "type": "boolean", "links": null, "slot_index": 1, "finalval": 399 }
    ],
    "properties": { "A": 1, "B": 1, "OP": ">" }
}


functionmap[node.type](node);