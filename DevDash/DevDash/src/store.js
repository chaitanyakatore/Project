import { configureStore } from "@reduxjs/toolkit";
import pinnedReposReducer from "./pinnedReposSlice";

export const store = configureStore({
  reducer: {
    // We are telling the store: "You have a section called 'pinnedRepos',
    // and it must follow the rules defined in pinnedReposReducer."
    pinnedRepos: pinnedReposReducer,
  },
});
