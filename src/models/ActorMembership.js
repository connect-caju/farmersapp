/**
 *
 *  ActorMembership identifies the actor within an organization
 */

export const ActorMembership = {
  name: "ActorMembership",
  primaryKey: "_id",
  properties: {
    _id: "string",
    actorId: "string",
    actorName: "string?",
    membership: "Membership[]",
    assets: "Assets[]",

    status: "string?", // pending, validated, invalidated
    checkedBy: "string?",

    userDistrict: "string?",
    userProvince: "string?",
    userId: "string",
    userName: "string?",

    createdAt: { type: "date", default: () => new Date() },
    modifiedAt: { type: "date", default: () => new Date() },
  },
}
