const whatsabi =  require("@shazow/whatsabi");

exports.loadAbi = async(
  address,provider
 
) => {
  try{
  //  / console.log(await getBackProxy(provider, _address));

  const code = await provider.eth.getCode(address);

  const signatureLookup = new whatsabi.loaders.SamczunSignatureLookup();
  const abiLike = whatsabi.abiFromBytecode(code);
  console.log("am i here");
  const abi = await Promise.all(
    abiLike.map((funcOrEvent) =>
      funcOrEvent.type === "function"
        ? signatureLookup
          .loadFunctions(funcOrEvent.selector)
          .then((value) =>
            value[0]
              ? `function ${value[0]} ${funcOrEvent.payable ? "payable" : ""}`
              : ""
          )
        : signatureLookup
          .loadEvents(funcOrEvent.hash)
          .then((value) => (value[0] ? `event ${value[0]}` : ""))
    )
  );
  const abiJson = 
    abi.filter((v) => v)  
  

  return abiJson;
  }catch(err){
    console.log(err);
  }
};