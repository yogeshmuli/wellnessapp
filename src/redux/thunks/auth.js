import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import axiosInstance from "../axios";

const user = {
  credentials: { username: "admin@gmail.com", password: "password@123" },
  details: {
    name: "Admin User",
    email: "admain@email.com",
    role: "admin",
    token: "auth_admin_token",
  },
};

export const login = createAsyncThunk("auth/login", async (model, thunkAPI) => {
  try {
    let result = await signInWithEmailAndPassword(
      getAuth(),
      model.username,
      model.password
    );
    const user = result.user;
    const userDetails = {
      name: user.displayName || "User",
      email: user.email,
      role: "user", // Default role, can be changed based on your logic
      token: user.uid, // Using user ID as token, adjust as needed
    };

    return userDetails;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const createUser = createAsyncThunk(
  "auth/createUser",
  async (model, thunkAPI) => {
    try {
      //  Create user with email and password
      let result = await createUserWithEmailAndPassword(
        getAuth(),
        model.email,
        model.password
      );
      // get token from fb to use as auth token in backend
      let tokenForBackend = await result.user.getIdToken();

      //  Todo: Save user details to backend using createUserInDb
      let requestObject = {
        idToken: tokenForBackend,
        fullName: model.fullname,
        email: model.email,
        age: model.age,
        primaryGoal: model.primaryGoal,
        interests: model.interest,
      };
      // use create user in db thunk to create user in the backend
      await thunkAPI.dispatch(createUserInDb(requestObject)).unwrap();

      return true;
    } catch (error) {
      // Handle error, e.g., user already exists
      if (error.code === "auth/email-already-in-use") {
        return thunkAPI.rejectWithValue({
          message: "Email already in use. Please try another email.",
        });
      }
      if (error.code === "auth/invalid-email") {
        return thunkAPI.rejectWithValue({
          message: "Invalid email format. Please enter a valid email.",
        });
      }
      if (error.code === "auth/weak-password") {
        return thunkAPI.rejectWithValue({
          message: "Weak password. Please enter a stronger password.",
        });
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// createUserInDb thunk to create user in the backend
/**
 * @route POST /auth/register
 * @summary Register a new user with Firebase token and profile info
 * @param {Object} req.body
 * @param {string} req.body.idToken - Firebase ID token
 * @param {string} req.body.fullName - Full name of the user
 * @param {string} req.body.email - Email address
 * @param {number} [req.body.age] - Age of the user
 * @param {string} [req.body.primaryGoal] - Primary goal
 * @param {string[]} [req.body.interests] - Array of interests
 * @returns {Object} 200 - User object
 * @returns {Object} 400 - Missing required fields
 * @returns {Object} 401 - Invalid token
 */
export const createUserInDb = createAsyncThunk(
  "auth/createUserInDb",
  async (model, thunkAPI) => {
    try {
      let requestObject = {
        idToken: model.idToken,
        fullName: model.fullName,
        email: model.email,

        age: parseInt(model.age, 10) || null, // Ensure age is a number or null
        primaryGoal: model.primaryGoal,
        interests: Array.isArray(model.interests) ? model.interests : [], // Ensure interests is an array
      };
      const response = await axiosInstance.post(
        "/auth/register",
        requestObject
      );
      return response.data;
    } catch (error) {
      // if this fails then delete the user from firebase
      try {
        await getAuth().currentUser.delete();
      } catch (deleteError) {
        console.error("Failed to delete user from Firebase:", deleteError);
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    // sign out from Firebase
    await getAuth().signOut();
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
