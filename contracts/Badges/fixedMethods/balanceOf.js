//
// usage: clevis contract balanceOf Badges
//
module.exports = async (contract,params,args)=>{
  const methodArgs = prepareMethodParams(3, 4, args);
  return await contract.methods.balanceOf.apply(null, methodArgs).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
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
