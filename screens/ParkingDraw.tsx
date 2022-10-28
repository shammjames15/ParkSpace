import {Button,Pressable,StyleSheet,Text,View} from "react-native";
import React, { useContext, useState } from "react";
import { RootStackScreenProps } from "../navigation/types";
import { ParkingLotContext } from "../store/context/ParkingLotProvider";
import NewPark from "../components/NewPark";
import { showAlertToast } from "../helpers";
import ParkingDrawing from "../components/ParkingDrawing";

const ParkingDraw = ({
  navigation,
}: RootStackScreenProps<"ManageParkingLot">) => {
  const { parkingLotState, parkingLotDispatch } = useContext(ParkingLotContext);
  const [isInputFieldsOpen, setIsInputFieldsOpen] = useState(false);

  const availableSpaceCount = parkingLotState.availableSpaces.length;
  const totalSpaceCount = parkingLotState.allSpaceIds.length;

  function openInputDialog() {
    if (availableSpaceCount > 0) {
      setIsInputFieldsOpen(true);
    } else {
      
      showAlertToast("No space available");
    }
  }

  function closeInputDialog() {
    setIsInputFieldsOpen(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.headerSectionContentContainer}>
          <Pressable
            style={styles.headerNavButton}
            onPress={() => {
              navigation.navigate("CreateParkingLot");
            }}
          >
            <Text style={styles.headerSectionText}>Create New Parking</Text>
          </Pressable>
          <Text
            style={styles.headerSectionText}
          >{`Available Spaces: ${availableSpaceCount} of ${totalSpaceCount}`}</Text>
        </View>
      </View>

      <View style={styles.parkingDrawingSection}>
        <ParkingDrawing />
      </View>

      <View style={styles.addNewParkingSection}>
        {isInputFieldsOpen ? (
          <NewPark closeInputDialog={closeInputDialog} />
        ) : (
          <Button
            title="Add new parking"
            onPress={openInputDialog}
            color="#0551b4"
          />
        )}
      </View>
    </View>
  );
};

export default ParkingDraw;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  parkingDrawingSection: {
    flex: 1,
    backgroundColor: "#f5efef",
    alignItems: "center",
  
  },
  addNewParkingSection: {
    padding: 15,
    alignItems: "stretch",
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dad9d9",
  },
  headerSectionContentContainer: {},
  headerNavButton: {
    alignSelf: "flex-end",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginTop: 8,
    borderRadius: 5,
    marginBottom: 10
  },
  headerSectionText: {
    fontFamily: "monospace",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 5,
    backgroundColor: "cornflowerblue",
    color: "silver",
  },
});
