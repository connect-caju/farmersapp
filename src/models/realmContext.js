
import 'react-native-get-random-values';
import {  createRealmContext } from "@realm/react";
import { 
    PlantTypes, Assets, FarmlandBlock, SprayingServiceBeneficiary, 
    Address, Contact, Density, IdDocument, Members, Name, Manager, 
    Coordinates, InvalidationMessage, SameTypeTrees, Membership,
    SprayingService,
} from "./EmbbededSchemas";
import { Actor } from "./Actor";
// import { ActorCategory } from './ActorCategory';
import { Farmland } from "./Farmland";
import { Institution } from "./Institution";
import { User } from "./User";
import { Group } from "./Group";
import { UserStat } from './UserStat';
import { InvalidationMotive } from './InvalidationMotive';
import { SprayingServiceProvider } from './SprayingServiceProvider';
import { ActorMembership } from './ActorMembership';


export const realmContext = createRealmContext({
    schema: [
        Actor,
        ActorMembership,
        Assets,
        SprayingServiceBeneficiary,
        SprayingServiceProvider,
        SprayingService,
        FarmlandBlock,
        Group, 
        Membership,
        Institution, 
        Members, 
        Address, 
        Manager, 
        Name, 
        Contact, 
        IdDocument, 
        Farmland, 
        Density,
        PlantTypes,
        SameTypeTrees, 
        Coordinates,
        InvalidationMotive,
        InvalidationMessage,
        UserStat,
        User,
    ],
    schemaVersion: 11,
    // deleteRealmIfMigrationNeeded: true,
})

