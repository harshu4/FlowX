const express = require('express');
const call = require("./infura.js");
const app = express();
var bodyParser = require('body-parser')
const port = 4040;


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())



async function tell(event){
    console.log(event);
}

app.post('/getdata', async (req, res) => {
try{
    let abc = await call.handlecontracts(req.body.contractmap,tell);
    console.log('here')
    res.send({status:true})
}
catch (err){
    res.send({status:false})

}
  });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);


    call.handlecontracts({ "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889": ['Deposit', 'Withdrawal'] }, tell)
});



