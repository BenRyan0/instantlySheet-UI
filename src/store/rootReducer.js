import instantlyAiReducer  from "./reducers/instantlyAiReducer";
import sheetReducer  from "./reducers/sheetReducer";


const rootReducers = {
  sheet: sheetReducer,
  instantlyAi : instantlyAiReducer
};
export default rootReducers;
