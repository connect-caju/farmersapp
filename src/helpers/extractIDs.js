
export const extractIDs = (farmersList)=>{

 // Array of objects whose properties are ids as follows
 // prev: referring to the previous farmer's id
 // current: referring to the current farmer's id
 // next: referring to the next farmer's id
 // 
 return farmersList?.map((item, index)=>{
  if (farmersList[index - 1] && farmersList[index + 1]) {
   return {
    prev: farmersList[index - 1]._id,
    next: farmersList[index + 1]._id,
    current: item._id,
   }
  }
  else if (!farmersList[index - 1] && farmersList[index + 1]){
   return {
    prev: null,
    next: farmersList[index + 1]._id,
    current: item._id,
   }
  }
  else if (farmersList[index - 1] && !farmersList[index + 1]){
   return {
    prev: farmersList[index - 1]._id,
    next: null,
    current: item._id,
   }
  }
  else if (!farmersList[index - 1] && !farmersList[index + 1]){
   return {
    prev: null,
    next: null,
    current: item._id,
   }
  }
 } )


}