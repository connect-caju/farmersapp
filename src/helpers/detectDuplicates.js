
// loop over suspectedDuplicates to detect any evidence of
// duplications
export const detectDuplicates = (newFarmer, duplicates) => {

    // check if names are equal
    const checkNames = (newFarmerNames, suspectedNames) =>{
        return (
            (suspectedNames.surname.toLowerCase().indexOf(newFarmerNames.surname.toLowerCase()) != -1)
            &&
            (suspectedNames.otherNames.toLowerCase().indexOf(newFarmerNames.otherNames.toLowerCase()) != -1)
        ) 
        ||
        (
            (newFarmerNames.surname.toLowerCase().indexOf(suspectedNames.surname.toLowerCase()) != -1)
            &&
            (newFarmerNames.otherNames.toLowerCase().indexOf(suspectedNames.otherNames.toLowerCase()) != -1)

        )
    }

    // check if addresses are equal
    const checkAddress = (newFarmerAddress, suspectedAddress) =>{
        return (
            (
                (newFarmerAddress?.adminPost && suspectedAddress?.adminPost && (newFarmerAddress?.adminPost === suspectedAddress?.adminPost)) 
                ||
                (!newFarmerAddress?.adminPost && !suspectedAddress?.adminPost) 
            )
            &&
            (
                (newFarmerAddress?.district && suspectedAddress?.district && (newFarmerAddress?.district === suspectedAddress?.district)) 
                ||
                (!newFarmerAddress?.district && !suspectedAddress?.district)             
            )
        )
    }

    return duplicates?.filter((farmer)=>{
        return checkNames(newFarmer?.names, farmer?.names) && checkAddress(newFarmer?.address, farmer?.address);
    })
}
