import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

export const userLogout = createAsyncThunk(
  "auth/userLogout",
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    const { token } = getState().auth;
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await api.get("/auth/signout", config);
      localStorage.removeItem("accessToken");

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const ChangeUserPassWord = createAsyncThunk(
//   "auth/ChangeUserPassword",
//   async ({ Credential }, { fulfillWithValue, rejectWithValue, getState}) => {
//     const { token } = getState().auth;
//     const config = {
//       headers: {
//         authorization: `Bearer ${token}`,
//       },
//     };

//     try {
//       const { data } = await api.post("/auth/change-user-password", Credential, config);
//       console.log("Change Password ----------------------");
//       console.log(data);

//       localStorage.setItem("accessToken", data.token);

//       return fulfillWithValue(data);
//     } catch (err) {
//       console.log(err);
//       return rejectWithValue(err.response.data);
//     }
//   }
// );
export const login = createAsyncThunk(
  "auth/login",
  async ({ Credential }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", Credential);
      console.log(data);

      localStorage.setItem("accessToken", data.token);

      return fulfillWithValue(data);
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response.data);
    }
  }
);

const decodedToken = (token) => {
  if (!token) {
    return ""; // No token, return an empty role
  }

  try {
    const userinfo = jwtDecode(token);
    const expireTime = new Date(userinfo.exp * 1000);

    if (new Date() > expireTime) {
      localStorage.removeItem("accessToken");
      return ""; // Token expired, clear the role
    } else {
      return userinfo;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return ""; // If decoding fails, return an empty role
  }
};

// export const get_user_info = createAsyncThunk(
//   "auth/get_user_info",
//   async (_, { rejectWithValue, fulfillWithValue, getState }) => {
//     const { token } = getState().auth;
//     const config = {
//       headers: {
//         authorization: `Bearer ${token}`,
//       },
//     };

//     console.log(config);
//     // const token = localStorage.getItem("accessToken");
//     if (token === "undefined") {
//       return rejectWithValue("No token found. Please log in.");
//     }
//     try {
//       const { data } = await api.get(`/auth/get-user`, config);
//       // const { data } = await axios.get("/get-user", config);
//       return fulfillWithValue(data);
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Unknown error");
//     }
//   }
// );

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    loader: false,
    errorMessage: "",
    successMessage: "",
    userInfo: decodedToken(localStorage.getItem("accessToken")),
    token: localStorage.getItem("accessToken"),
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    redirectClear: (state) => {
      state.redirect = 0;
      // state.successMessage = "";
    },
    user_reset: (state) => {
      state.userInfo = "";
    },
  },

  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const user = decodedToken(action.payload.token);
      state.loader = false;
      state.successMessage = action.payload.message;
      state.userInfo = user;
      state.token = action.payload.token; // ✅ update token in Redux
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload.error;
      // console.log("Login failed:", action.payload.error);
    });

    // builder.addCase(get_user_info.pending, (state) => {
    //   state.loader = true;
    // });
    // builder.addCase(get_user_info.rejected, (state, action) => {
    //   state.loader = false;
    //   state.errorMessage = action.payload || "Failed to fetch user info";
    // });
    // builder.addCase(get_user_info.fulfilled, (state, action) => {
    //   state.loader = false;
    //   state.userInfo = action.payload.userInfo;

    // });

    builder.addCase(userLogout.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(userLogout.rejected, (state, action) => {
      state.loader = false;
      state.errorMessage = action.payload || "Failed to fetch user info";
    });
    builder.addCase(userLogout.fulfilled, (state) => {
      state.loader = false;
      state.userInfo = "";
    });
  },
});

export const { messageClear, redirectClear, user_reset } = authReducer.actions;
export default authReducer.reducer;
