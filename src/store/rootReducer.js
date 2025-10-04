import instantlyAiReducer  from "./reducers/instantlyAiReducer";
import sheetReducer  from "./reducers/sheetReducer";
import logsReducer from "./reducers/logsReducer";
import authReducer from "./reducers/authReducer";


const rootReducers = {
  auth: authReducer,
  sheet: sheetReducer,
  instantlyAi : instantlyAiReducer,
  logs : logsReducer
};
export default rootReducers;
