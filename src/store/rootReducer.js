import instantlyAiReducer  from "./reducers/instantlyAiReducer";
import sheetReducer  from "./reducers/sheetReducer";
import logsReducer from "./reducers/logsReducer";
import authReducer from "./reducers/authReducer";
import toBeEncodedReducer from "./reducers/toBeEncodedReducer";


const rootReducers = {
  auth: authReducer,
  sheet: sheetReducer,
  instantlyAi : instantlyAiReducer,
  logs : logsReducer,
  toBeEncoded: toBeEncodedReducer
};
export default rootReducers;
