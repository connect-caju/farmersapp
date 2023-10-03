
# Decision Records
==============================
### Decision structure:
- Context
- Alternatives
- Choices
- Impacts

## Decision 1: Write an algorithm that generate a Universal Farmer Identifier (UFID) for each individual farmer
- Context: 
    Farmers' registration process is prone to duplications. 
    Generating a UFID can help prevent farmers' registration duplications
- Algorithm:
    Made of 19 characters: "ab.mmddyy.xyxyxy.so"
    ab: the first 2 characters of the farmer's first name;
    mmddyy: the month, day, and year of the farmer's birth;
    xyxyxy: the post code or the code of the farmer's place of birth;
    so: the first 2 characters of the farmer's surname.

    if the farmer was born in a foreign countries, then get the code associated to that country;
    else if the farmer was born in Maputo capital, then get the code associated to Maputo City;
    else if the farmer was born in Maputo province, then get the code associated to that district of Maputo province;
    else if the farmer was born in one of the provincial capitals, then get the code associated to that province;
    else get the code associated to the administrative post in which the farmer was born.

  ## Decision 2: 


