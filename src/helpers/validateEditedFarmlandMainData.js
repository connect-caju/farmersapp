

import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { capitalize } from "./capitalize";
/**
 * 
 * @param {*} farmerData 
 * @param {*} errors 
 * @param {*} setErrors 
 * @returns false if invalid data found, farmerdata if no invalid data found
 * 
 * This function sanitizes, and validates all the farmer data before they
 * are persisted. 
 * Invalid data trigger errorMessages to the respective input component
 * in the form.
 */

const validateEditedFarmlandMainData = (
    {   

        description, consociatedCrops, totalArea,
        trees, oldDescription, oldConsociatedCrops,
        oldTotalArea, oldTrees, 
        blocks,
    }, errors, setErrors, dataToBeUpdated, resourceName,
    ) => {

    // sanitizing recieved data
     if ( dataToBeUpdated === 'farmlandMainData' && resourceName == 'Farmland') {

      const retrievedDescription = description ? description?.trim() : '';
      const retrievedTotalArea = totalArea ? parseFloat(totalArea) : '';
      const retrievedTrees = trees ? Number(parseInt(trees)) : '';
      const retrievedConsociatedCrops = consociatedCrops?.length > 0 ? consociatedCrops : [];

      const retrievedOldDescription =  oldDescription ? oldDescription?.trim() : '';
      const retrievedOldTotalArea = oldTotalArea ? parseFloat(oldTotalArea) : '';
      const retrievedOldTrees = oldTrees ? Number(parseInt(oldTrees)) : 0;
      const retrievedOldConsociatedCrops = oldConsociatedCrops?.length > 0 ? oldConsociatedCrops : [];

      const retrievedBlocks = [...blocks];

    //   console.log(`area: ${retrievedTotalArea} - ${retrievedOldTotalArea}`);
    //   console.log(`description: ${retrievedDescription} - ${retrievedOldDescription}`);
    //   console.log(`trees: ${retrievedTrees} - ${retrievedOldTrees}`);
    //   console.log(`crops: ${retrievedConsociatedCrops} - ${retrievedOldConsociatedCrops}`);

      if (
       (retrievedDescription === retrievedOldDescription) 
       &&
       (retrievedTotalArea === retrievedOldTotalArea)
       &&
       (retrievedTrees === retrievedOldTrees)
       &&
       (
        (retrievedConsociatedCrops?.length === retrievedOldConsociatedCrops?.length)
        &&
        (retrievedConsociatedCrops.every((el, index) => el === retrievedOldConsociatedCrops[index]))
        )
      
      ) {
       setErrors({
        ...errors,
        description: 'A localização actual não deve ser igual à anterior',
        consociatedCrops: 'As culturas consociadas actuais não podem ser iguais às anteriores.',
        trees: 'O número de cajueiros actual não pode ser igual ao anterior.',
        totalArea: 'A área actual não pode ser igual à anteior.',
       });
       
       return false;
      }
      
    if (!retrievedDescription) { 
        setErrors({ ...errors,
            description: 'Descreva a localização deste pomar.',
        });
        return false;
    }

    if (retrievedConsociatedCrops.length === 0) { 
        setErrors({ ...errors,
            consociatedCrops: 'Selecciona culturas consociadas.',
        });
        return false;
    }
    else if(retrievedConsociatedCrops.find((crop)=>crop.includes('Nenhuma')) && retrievedConsociatedCrops.length > 1){
        setErrors({ ...errors,
            consociatedCrops: 'Culturas seleccionadas inválidas.',
        });
        return false;
    } 

    if (!retrievedTrees){
        setErrors({ ...errors,
            trees: 'Indica número de cajueiros.',
        });
        return false;
    }
   
    if (!retrievedTotalArea){
        setErrors({ ...errors,
            declaredArea: 'Área total.',
        });
        return false;
    }

    if ((retrievedBlocks?.length > 0) &&
        (retrievedTotalArea < retrievedBlocks?.map(block =>block.usedArea).reduce((acc, el)=>acc + el, 0))
        &&
        (retrievedTrees < retrievedBlocks?.map(block=>block.trees).reduce((acc, el)=>acc + el, 0))
    ){
        setErrors({
            ...errors,
            areaInconsistencies: 'A área total é inferior à soma das áreas dos blocos.',
            treesInconsistencies: 'O número total de cajueiros é inferior à soma dos cajueiros dos blocos.'

        });
        return false;
    }



    if ((retrievedBlocks?.length > 0) && 
        (retrievedTrees < retrievedBlocks?.map(block=>block.trees).reduce((acc, el)=>acc + el, 0))
    ){
        setErrors({
            ...errors,
            treesInconsistencies: 'O número total de cajueiros não deve ser inferior à soma dos cajueiros dos blocos.'
        });
        return false;
    }

    if ((retrievedBlocks?.length > 0) &&
        (retrievedTotalArea < retrievedBlocks?.map(block =>block.usedArea).reduce((acc, el)=>acc + el, 0))
    ){
        setErrors({
            ...errors,
            areaInconsistencies: 'A área total não deve ser inferior à soma das áreas dos blocos.'
        });
        return false;
    }

      return {
        trees: retrievedTrees, 
        totalArea: retrievedTotalArea, 
        consociatedCrops: retrievedConsociatedCrops ,
        description: retrievedDescription,
    }
   
      
     }




};

export default validateEditedFarmlandMainData;