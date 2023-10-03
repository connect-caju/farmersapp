import {
  faBirthdayCake,
  faEllipsisVertical,
  faHome,
  faIdCard,
  faLegal,
  faObjectGroup,
  faPeopleGroup,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Icon } from "@rneui/base"
import { Stack, Box, Center } from "native-base"

import React from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import Animated from "react-native-reanimated"
import CustomDivider from "../Divider/CustomDivider"
import COLORS from "../../consts/colors"
import { bottomSheetFlags } from "../../consts/bottomSheetFlags"
import { calculateAge } from "../../helpers/dates"
import { groupAffiliationStatus } from "../../consts/groupAffiliationStatus"

export default function GroupDetailsCard({
  handlePresentModalPress,
  farmer,
  customUserData,
  onPressEllipsis,
  groupManager,
}) {
  return (
    <Animated.View
      // entering={BounceIn.duration(1000)}
      style={{
        width: "100%",
        borderRadius: 15,
        padding: 8,
        borderColor: COLORS.dark,
        backgroundColor: COLORS.ghostwhite,
        marginVertical: 10,
        elevation: 3,
        opacity: 1,
      }}
    >
      <Stack
        w="100%"
        direction={"row"}
        style={{
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            width: "20%",
          }}
        >
          {groupManager?.image ? (
            <Image
              source={{ uri: groupManager?.image }}
              style={{
                width: 50,
                height: 50,
                borderColor: COLORS.main,
                marginHorizontal: 3,
                borderRadius: 120,
              }}
            />
          ) : (
            <Icon name="account-circle" size={60} color={COLORS.lightgrey} />
          )}
        </View>
        <View
          style={{
            width: "70%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: groupManager?.image ? COLORS.black : COLORS.grey,
              fontSize: 16,
              fontFamily: "JosefinSans-Bold",
              alignItems: "baseline",
            }}
          >
            {groupManager?._id
              ? `${groupManager?.names.otherNames} ${groupManager?.names.surname}`
              : farmer?.type === "Cooperativa"
              ? "Sem Presidente"
              : "Sem Representante"}
          </Text>
          {groupManager?._id && (
            <Text
              style={{
                color: COLORS.grey,
                fontSize: 12,
                fontFamily: "JosefinSans-Regular",
                alignItems: "baseline",
              }}
            >
              {farmer?.type === "Cooperativa"
                ? "(Presidente)"
                : "(Representante)"}
            </Text>
          )}
        </View>
        <View
          style={{
            width: "10%",
            justifiyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{}}
            //  onPress={()=>onPressEllipsis(bottomSheetFlags.groupDetails)}
            onPress={handlePresentModalPress}
          >
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              size={20}
              color={COLORS.main}
            />
          </TouchableOpacity>
        </View>
      </Stack>

      <CustomDivider thickness={2} color={COLORS.lightgrey} />

      <View
        style={{
          padding: 8,
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "50%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon icon={faHome} size={20} color={COLORS.grey} />
              </View>

              <View
                style={{
                  width: "70%",
                }}
              >
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  {farmer?.address?.district
                    ? farmer?.address?.adminPost
                    : "Não Aplicável"}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  {farmer?.address?.adminPost
                    ? farmer?.address?.village
                    : "Não Aplicável"}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "50%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "30%",
                }}
              >
                <Icon name="phone-in-talk" size={25} color={COLORS.grey} />
              </View>

              <View
                style={{
                  width: "70%",
                }}
              >
                {groupManager &&
                  groupManager?.contact?.primaryPhone !== 0 &&
                  groupManager?.contact?.secondaryPhone !== 0 && (
                    <>
                      <Text
                        style={{
                          color: "grey",
                          fontSize: 13,
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {groupManager?.contact?.primaryPhone}
                      </Text>
                      <Text
                        style={{
                          color: "grey",
                          fontSize: 13,
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {groupManager?.contact?.secondaryPhone}
                      </Text>
                    </>
                  )}
                {groupManager &&
                  groupManager?.contact?.primaryPhone !== 0 &&
                  groupManager?.contact?.secondaryPhone === 0 && (
                    <Text
                      style={{
                        color: "grey",
                        fontSize: 13,
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      {groupManager?.contact?.primaryPhone}
                    </Text>
                  )}

                {groupManager &&
                  groupManager?.contact?.primaryPhone === 0 &&
                  groupManager?.contact?.secondaryPhone !== 0 && (
                    <Text
                      style={{
                        color: "grey",
                        fontSize: 13,
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      {groupManager?.contact?.secondaryPhone}
                    </Text>
                  )}

                {((groupManager?.contact?.primaryPhone === 0 &&
                  groupManager?.contact?.secondaryPhone === 0) ||
                  !groupManager) && (
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 13,
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    Tel: Nenhum
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>

      <CustomDivider thickness={2} color={COLORS.lightgrey} />

      <View
        style={{
          padding: 8,
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "50%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  style={
                    {
                      // alignSelf: 'center',
                    }
                  }
                  icon={faPeopleGroup}
                  size={20}
                  color={COLORS.grey}
                />
              </View>

              <View
                style={{
                  width: "70%",
                }}
              >
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  {farmer?.type}{" "}
                  {farmer?.operationalStatus ? "Activo" : "Inactivo"}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Criado em {farmer?.creationYear}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "50%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon icon={faLegal} size={20} color={COLORS.grey} />
              </View>

              <View
                style={{
                  width: "70%",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  {farmer?.legalStatus}
                </Text>
                {farmer?.legalStatus === groupAffiliationStatus.affiliated && (
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 13,
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    Desde {farmer?.affiliationYear}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>

      <CustomDivider thickness={2} color={COLORS.lightgrey} />

      <View
        style={{
          padding: 8,
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "50%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  style={
                    {
                      // alignSelf: 'center',
                    }
                  }
                  icon={faObjectGroup}
                  size={20}
                  color={COLORS.grey}
                />
              </View>

              <View
                style={{
                  width: "70%",
                }}
              >
                <Text
                  style={{
                    color: COLORS.grey,
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Finalidade:{" "}
                  {farmer?.assets?.length > 0
                    ? farmer?.assets
                        ?.map((asset) => asset.subcategory)
                        ?.join("; ")
                    : "Não específica"}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "50%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  style={
                    {
                      // alignSelf: 'center',
                    }
                  }
                  icon={faIdCard}
                  size={20}
                  color={COLORS.grey}
                />
              </View>

              <View
                style={{
                  width: "70%",
                }}
              >
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  NUIT: {farmer?.nuit ? farmer?.nuit : "Nenhum"}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Alvará: {farmer?.licence ? farmer?.licence : "Nenhum"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <CustomDivider thickness={2} color={COLORS.lightgrey} />

      <View
        style={{
          padding: 8,
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "50%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  style={
                    {
                      // alignSelf: 'center',
                    }
                  }
                  icon={faUserGroup}
                  size={20}
                  color={COLORS.grey}
                />
              </View>

              <View
                style={{
                  width: "70%",
                }}
              >
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Homens:{" "}
                  {farmer?.numberOfMembers?.total -
                    farmer?.numberOfMembers?.women}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Mulhers: {farmer?.numberOfMembers?.women}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "50%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                // alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: "30%",
                }}
              >
                <Icon name="location-pin" size={25} color={COLORS.grey} />
              </View>

              <View
                style={{
                  width: "70%",
                }}
              >
                <Text
                  style={{
                    color: "grey",
                    fontSize: 12,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Long:{" "}
                  {farmer?.geolocation?.longitude
                    ? farmer?.geolocation?.longitude
                    : "Nenhuma"}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 12,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Lat:{" "}
                  {farmer?.geolocation?.latitude
                    ? farmer?.geolocation?.latitude
                    : "Nenhuma"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <CustomDivider thickness={2} color={COLORS.lightgrey} />

      <View
        style={{
          backgroundColor: COLORS.fourth,
        }}
      >
        <Text
          style={{
            textAlign: "right",
            color: COLORS.grey,
            fontFamily: "JosefinSans-Italic",
            fontSize: 12,
          }}
        >
          Registado por{" "}
          {farmer?.userName === customUserData?.name ? "mim" : farmer?.userName}{" "}
          aos {new Date(farmer?.createdAt).getDate()}-
          {new Date(farmer?.createdAt).getMonth() + 1}-
          {new Date(farmer?.createdAt).getFullYear()}
        </Text>

        {farmer?.modifiedBy && (
          <Text
            style={{
              textAlign: "right",
              color: COLORS.grey,
              fontFamily: "JosefinSans-Italic",
              fontSize: 12,
            }}
          >
            Actualizado por{" "}
            {farmer?.modifiedBy === customUserData?.name
              ? "mim"
              : farmer?.modifiedBy}{" "}
            aos {new Date(farmer?.modifiedAt).getDate()}-
            {new Date(farmer?.modifiedAt).getMonth() + 1}-
            {new Date(farmer?.modifiedAt).getFullYear()}
          </Text>
        )}
      </View>
    </Animated.View>
  )
}
