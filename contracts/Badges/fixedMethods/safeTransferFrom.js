//
// usage: clevis contract safeTransferFrom Badges ##accountindex## _from _to _tokenId _amount _data
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  const methodArgs = prepareMethodParams(4, 8, args);
  if(DEBUG) console.log("**== Running safeTransferFrom("+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.safeTransferFrom.apply(null, methodArgs).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}

function prepareMethodParams(firstParam, lastParam, args) {
  let i;
  let result = [];
  for (i = lastParam; i >= firstParam; --i) {
    if (args[i] !== undefined) break;
  }
  for (let ii = firstParam; ii <= i; ++ii) {
    result.push(args[ii]);
  }
  return result;
}
