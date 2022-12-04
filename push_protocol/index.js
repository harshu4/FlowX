const PushAPI =require('@pushprotocol/restapi')
const ethers = require("ethers")

const PK = process.env.PUSH_CHANNEL_PK || '6b5ebe5ce5c0ec0115a0f31617239bedc772c5cc8bb2b4ac850a2964667da91a'; // channel private key
const Pkey = `0x${PK}`;


const signer = new ethers.Wallet(Pkey);

exports.sendNotification = async(title, body, recipients, channel) => {
  try {

    console.log("title is" + title)
    console.log("recipent is" + recipients)
    console.log("channel is" + channel)
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: title,
        body: body
      },
      payload: {
        title: title,
        body: body,
        cta: '',
        img: ''
      },
      recipients: `eip155:5:${recipients}`, // recipient address
      channel: `eip155:5:${channel}`, // your channel address
      env: 'staging'
    });
    
    // apiResponse?.status === 204, if sent successfully!
   // console.log('API repsonse: ', apiResponse);
  } catch (err) {
    console.error('Error: ', err);
  }
}
