import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";


export const trader_register = createAsyncThunk(
  "auth/trader_register",
  async (info, {fulfillWithValue, rejectWithValue}) => {
    try {
      const { data } = await api.post("/trader/trader-register", info);
      console.log(data);
      localStorage.setItem('traderToken', data.token)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
);
export const trader_login = createAsyncThunk(
  "auth/trader_login",
  async (info, {fulfillWithValue, rejectWithValue}) => {
    try {
      const { data } = await api.post("/trader/trader-login", info);
      console.log("----------------------------- >")
      console.log(data);
      localStorage.setItem('traderToken', data.token)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
);

// Async thunk for trader change password
export const trader_changePassword = createAsyncThunk(
  "auth/trader_changePassword",
  async (info, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/trader/change-password", info);
      // Clearing the token after password change to force a re-login
      localStorage.removeItem("traderToken");
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const decodedToken = (token) =>{
  if (!token) {
    return ""; // No token, return an empty role
  }

  try {
    const userinfo = jwtDecode(token);
    const expireTime = new Date(userinfo.exp * 1000);

    if (new Date() > expireTime) {
      localStorage.removeItem("traderToken");
      return ""; // Token expired, clear the role
    } else {
      return userinfo;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return ""; // If decoding fails, return an empty role
  }
}

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    loader: false,
    userInfo:decodedToken(localStorage.getItem('traderToken')),
    errorMessage: "",
    successMessage: "",
    redirect: 0,
    token: localStorage.getItem("traderToken")
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    redirectClear: (state, _) => {
      state.redirect = 0;
      // state.successMessage = "";
    },
    user_reset: (state, _) => {
      state.userInfo = ""
   }
  },


  extraReducers: (builder) => {
    builder.addCase(trader_register.pending, (state,_) => {
      state.loader= true;
      });
    builder.addCase(trader_register.rejected, (state, payload) => {
      state.loader= false;
      state.errorMessage = payload.payload.error;
     
      });
    builder.addCase(trader_register.fulfilled, (state, payload) => {
        const user = decodedToken(payload.payload.token)
        state.loader= false;
        state.successMessage = payload.payload.message;
        state.userInfo = user
        
      }); 

    builder.addCase(trader_login.pending, (state,_) => {
      state.loader= true;
      });
    builder.addCase(trader_login.rejected, (state, payload) => {
      state.loader= false;
      state.errorMessage = payload.payload.error;
      state.redirect = payload.payload.redirect;
     
      });
    builder.addCase(trader_login.fulfilled, (state, payload) => {
      const user = decodedToken(payload.payload.token)
      console.log("TOKEN___________")
      console.log(user)
      state.loader= false;
        state.successMessage = payload.payload.message;
        state.redirect = payload.payload.redirect;
        state.userInfo = user;
        state.token = payload.payload.token;
      });


      builder.addCase(trader_changePassword.pending, (state,_) => {
        state.loader= true;
        });

      builder.addCase(trader_changePassword.rejected, (state,payload) => {
        state.loader= false;
        state.errorMessage = payload.payload.error;
        });

      builder.addCase(trader_changePassword.fulfilled, (state,payload) => {
        state.loader= false
        state.successMessage = payload.payload.message;
   
        });
   
},
  //   extraReducers: {},
});

export const { messageClear,redirectClear,user_reset } = authReducer.actions;
export default authReducer.reducer;