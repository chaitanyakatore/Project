// Line 1: Import the tool to build the main store.
import { configureStore } from "@reduxjs/toolkit";

// Line 2: Import the slice we just made.
import pinnedReposReducer from "./pinnedReposSlice";

// Line 3: Create the one and only store for the app.
export const store = configureStore({
  // Line 4: Tell the store about our slices.
  reducer: {
    // We are saying: "Store, you have a section called 'pinnedRepos', and it follows the rules we wrote in the slice."
    pinnedRepos: pinnedReposReducer,
  },
});
