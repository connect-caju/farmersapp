
export const getPosition = (coordinates) =>{
    const length = coordinates.length + 1;
    for (let i = 1; i <= length; i++) {
        const position = coordinates.find(p=>p.position == i);
        if (!position){
            return i;
        }
    }
    return length;
} 

// sort coordinates by their position
export const sortCoordinatesByPositions = (coordinates)=>{
    let toBeSorted = [...coordinates];
    let length = toBeSorted.length;

    return toBeSorted
            .map((coords)=>{
                if (coords.position == length) {
                    coords['icon'] = 'delete-forever';
                    return coords;
                }
                else {
                    coords['icon'] = 'check-circle';
                    return coords;
                }
            })
            .sort((a, b)=>(b?.position - a?.position));
}

export const calculateAuditedArea = (coordinates)=>{
    let extremeCoordinates = [...coordinates];
    //To do:
    // 1. extract all the coordinates with their respective positions;
    // 2. apply the formula used to calculate the area from the coordinates;
    // 3. return the result as a real number  

    return ;
}