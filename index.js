const express = require('express');
const call = require("./helper/listenEvent.js");
const app = express();
var bodyParser = require('body-parser')
const port = 4040;


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())



async function tell(event) {
    console.log(event);
}

app.post('/getdata', async (req, res) => {
    try {
        let abc = await call.handlecontracts(req.body.contractmap, tell);
        console.log('here')
        res.send({ status: true })
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

    catch(err){
        console.log(err);
        res.send({status:false});
    }
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);



});



