
// sum all the numbers of the trees
export const sumTreesOrAreas = (farmlands, flag)=>{

    if (flag === 'trees'){
        // get all the numbers of trees from all the farmlands
        const trees = farmlands?.map(farmland=>farmland.trees);
    
        // sum all the numbers
        return trees?.reduce((acc, value)=>acc + value, 0);

    }
    else if (flag === 'declaredAreas') {
        // get all the numbers of declaredAreas from all the farmlands
        const declaredAreas = farmlands?.map(farmland=>farmland.totalArea);
    
        // sum all the numbers
        return declaredAreas?.reduce((acc, value)=>acc + value, 0);
    }
    else if (flag === 'auditedAreas') {
        // get all the numbers of auditedareas from all the farmlands
        const auditedAreas = farmlands?.map(farmland=>farmland.auditedArea);
    
        // sum all the numbers
        return auditedAreas?.reduce((acc, value)=>acc + value, 0);
    }

}