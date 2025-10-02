import instantlyAiReducer  from "./reducers/instantlyAiReducer";
import sheetReducer  from "./reducers/sheetReducer";
import logsReducer from "./reducers/logsReducer";


const rootReducers = {
  sheet: sheetReducer,
  instantlyAi : instantlyAiReducer,
  logs : logsReducer
};
export default rootReducers;
