import { Button, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import React, { useContext, useState } from "react";
import { RootStackScreenProps } from "../navigation/types";
import { ParkingLotContext } from "../store/context/ParkingLotProvider";
import {
  getParkingChargeGivenTimeInHours,
  getTimeDifferenceInHours,
  showAlertToast,
} from "../helpers";
import axios from "axios";
import CheckoutDetails from "../components/CheckoutDetails";

const CarDeregister = ({
  navigation,
  route,
}: RootStackScreenProps<"CarDeregister">) => {
  const [isLoading, setIsLoading] = useState(false);
  const { parkingLotState, parkingLotDispatch } = useContext(ParkingLotContext);
  const { spaceId } = route.params;

  const { carRegistration, parkingTime } = parkingLotState.allocation[spaceId];
  const parkingDuration = getTimeDifferenceInHours(parkingTime);
  const parkingCharge = getParkingChargeGivenTimeInHours(parkingDuration);

  async function handleCheckout() {
    setIsLoading(true);
    try {
      const response = await axios.post("https://httpstat.us/200", {
        "car-registration": carRegistration,
        charge: parkingCharge,
      });
    
      const statusCode = response.data.code;
      if (statusCode !== 200) throw "http statusCode not 200";

      navigation.navigate("ManageParkingLot");
      parkingLotDispatch({ type: "car-checkout", payload: { spaceId } });
    } catch (error) {
      console.log({ error });
      showAlertToast("Could not connect to server");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <Button
          title="Go back"
          onPress={() => navigation.goBack()}
          color="#0551b4"
          testID="deregister-back-button"
        />
      </View>

      <CheckoutDetails
        {...{ carRegistration, parkingCharge, parkingDuration }}
      />

      <View style={styles.checkoutButtonWrapper}>
        {!isLoading && (
          <Button
            title="Payment Taken"
            onPress={handleCheckout}
            color="#0551b4"
            testID="deregister-payment-button"
          />
        )}
        {isLoading && (
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#0551b4" />
            <Text>Checking out...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CarDeregister;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    paddingHorizontal: 35,
    paddingTop: 60,
  },
  backButtonWrapper: {
    alignItems: "flex-start",
  },
  checkoutButtonWrapper: {
    alignItems: "stretch",
    paddingHorizontal: 8,
  },
  activityIndicatorWrapper:{
    alignItems: 'center'
  }
});
