import { createContext, useReducer } from "react";
import { shuffleArray } from "../../helpers";
import { AllocationData, ParkingLotState, SpaceId } from "../../types";
import produce from "immer";

{

}

type CreateParkingLotAction = {
  type: "create-parking-lot";
  payload: { spaceCount: number };
};

type AddNewParkingAction = {
  type: "add-new-parking";
  payload: {
    newParkingDetails: { parkingTime: Date; carRegistration: string };
  };
};

type CarCheckoutAction = {
  type: "car-checkout";
  payload: { spaceId: SpaceId };
};

type ParkingLotAction =
  | CreateParkingLotAction
  | AddNewParkingAction
  | CarCheckoutAction;

const parkingLotInitialState: ParkingLotState = {
  allSpaceIds: [],
  availableSpaces: [],
  allocation: {},
};

const parkingLotReducer = (
  state: ParkingLotState,
  action: ParkingLotAction
) => {
  switch (action.type) {
    case "create-parking-lot":
      return createParkingLot(action.payload.spaceCount);
    case "add-new-parking":
      return addNewParking(action.payload.newParkingDetails, state);
    case "car-checkout":
      return carCheckout(action.payload.spaceId, state);
    default:
      return state;
  }
};

function createParkingLot(numberOfSpaces: number): ParkingLotState {

  const allSpaceIds: SpaceId[] = [];
  for (let num = 1; num <= numberOfSpaces; num++) {
    allSpaceIds.push(num);
  }
  const availableSpaces = [...allSpaceIds];
  shuffleArray(availableSpaces);

  return { allocation: {}, allSpaceIds, availableSpaces };
}

function addNewParking(
  newParkingDetails: AddNewParkingAction["payload"]["newParkingDetails"],
  state: ParkingLotState
): ParkingLotState {
  const availableSpaceCount = state.availableSpaces.length;
  if (availableSpaceCount === 0) return state; 

  return produce(state, (draft) => {
    
    const spaceIdForAllocation: number =
      draft.availableSpaces[availableSpaceCount - 1]
    const newAllocationData: AllocationData = {
      ...newParkingDetails,
      spaceId: spaceIdForAllocation,
    };
    draft.allocation[spaceIdForAllocation] = newAllocationData;
    draft.availableSpaces.pop();
  });
}

function carCheckout(spaceId: number, state: ParkingLotState): ParkingLotState {
  const { allocation, availableSpaces } = state;
  if (allocation[spaceId] === undefined) return state; 

  return produce(state, (draft) => {
    delete draft.allocation[spaceId];
    draft.availableSpaces.push(spaceId);
  });
}

{

}

{
  
}

type ParkingLotContextType = {
  parkingLotState: ParkingLotState;
  parkingLotDispatch: React.Dispatch<ParkingLotAction>;
};

export const ParkingLotContext = createContext<ParkingLotContextType>({
  parkingLotState: parkingLotInitialState,
  parkingLotDispatch: () => null,
});

type ParkingLotContextProviderProps = { children: React.ReactNode };

export const ParkingLotProvider = ({
  children,
}: ParkingLotContextProviderProps) => {
  const [parkingLotState, parkingLotDispatch] = useReducer(
    parkingLotReducer,
    parkingLotInitialState
  );

  return (
    <ParkingLotContext.Provider value={{ parkingLotState, parkingLotDispatch }}>
      {children}
    </ParkingLotContext.Provider>
  );
};
