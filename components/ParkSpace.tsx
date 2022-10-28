import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, Pressable } from "react-native";
import { SpaceId } from "../types";

type ParkingSpaceProps = {
  spaceId: SpaceId;
  carRegistration?: string;
};

const ParkSpace = ({ spaceId, carRegistration }: ParkingSpaceProps) => {
  const navigation = useNavigation();
  const isOccupied = carRegistration !== undefined;

  const testID = isOccupied
    ? `parking-drawing-registered-${spaceId}`
    : `parking-drawing-space-number-${spaceId}`;

  function handleCheckout() {
    navigation.navigate("CarDeregister", { spaceId });
  }

  return (
    <Pressable
      testID={testID}
      style={[
        styles.parkingSpace,
        isOccupied ? styles.isOccupied : styles.isEmpty,
      ]}
      disabled={!isOccupied}
      onPress={handleCheckout}
    >
      <Text
        testID={`parking-drawing-space-${spaceId}`}
        style={[styles.spaceId, isOccupied && styles.spaceIdOccupied]}
      >
        {spaceId}
      </Text>
      {isOccupied && (
        <>
          <Text style={styles.carRegistration}>{carRegistration}</Text>
          <Text style={styles.occupiedLabel}>{"tap to checkout"}</Text>
        </>
      )}
    </Pressable>
  );
};

export default ParkSpace;

const styles = StyleSheet.create({
  parkingSpace: {
    marginHorizontal: 10,
    marginVertical: 12,
    width: 125,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#efefef",
  },
  isEmpty: {
    borderWidth: 2,
    borderColor: "#00b561",
    borderStyle: "dashed",
  },
  isOccupied: {
    backgroundColor: "#0551b4",
  },
  spaceId: {
    fontWeight: "500",
    fontSize: 20,
  },
  spaceIdOccupied: {
    color: "white",
  },
  occupiedLabel: {
    color: "#dddddd",
    fontSize: 12,
  },
  carRegistration: {
    color: "white",
    fontWeight: '500'
  },
});
