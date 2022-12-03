const express = require('express');
const call = require("./helper/listenEvent.js");
const logic = require("./helper/logic")
const app = express();
var bodyParser = require('body-parser')
const cors = require('cors');
const port = 4040;



var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));



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



app.get('/getabiview', async (req, res) => {
    try {
        console.log(req.query.contractadd)
        let abi = await call.getabiview(req.query.contractadd);
        console.log('here')
        res.send({ status: true ,abi:abi})
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



