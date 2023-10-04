import "react-native-get-random-values";
import { createRealmContext } from "@realm/react";
import { Actor } from "./Actor";
import { Farmland } from "./Farmland";
import { Institution } from "./Institution";
import { User } from "./User";
import { Group } from "./Group";
import { UserStat } from "./UserStat";
import { InvalidationMotive } from "./InvalidationMotive";
import { SprayingServiceProvider } from "./SprayingServiceProvider";
import { ActorMembership } from "./ActorMembership";
import { SprayingService } from "./embeddedObjects/SprayingService";
import { SprayingServiceBeneficiary } from "./embeddedObjects/SprayingServiceBeneficiary";
import { Assets } from "./embeddedObjects/Assets";
import { PlantTypes } from "./embeddedObjects/PlantTypes";
import { FarmlandBlock } from "./embeddedObjects/FarmlandBlock";
import { Address } from "./embeddedObjects/Address";
import { Contact } from "./embeddedObjects/Contact";
import { Density } from "./embeddedObjects/Density";
import { IdDocument } from "./embeddedObjects/IdDocument";
import { Members } from "./embeddedObjects/Members";
import { Name } from "./embeddedObjects/Name";
import { Manager } from "./embeddedObjects/Manager";
import { Coordinates } from "./embeddedObjects/Coordinates";
import { InvalidationMessage } from "./embeddedObjects/InvalidationMessage";
import { SameTypeTrees } from "./embeddedObjects/SameTypeTrees";
import { Membership } from "./embeddedObjects/Membership";

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
});
