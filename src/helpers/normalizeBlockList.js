

export const normalizeBlockList = (list)=>{
 let count = 0;
 let newList = list?.map(block=>{
     block['position'] = count;
     count += 1;
     return block;
 });
 return newList;

}