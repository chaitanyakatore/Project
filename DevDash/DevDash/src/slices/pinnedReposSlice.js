import { createSlice } from "@reduxjs/toolkit";

export const pinnedReposSlice = createSlice({
  // 1. The name of this slice of data
  name: "pinnedRepos",

  // 2. The starting point: an empty array because nothing is pinned yet
  initialState: [],

  // 3. The Reducers: The strict rules for how to change this data
  reducers: {
    pinRepo: (state, action) => {
      // action.payload will be the repository object the user clicked.
      // We check if it already exists so we don't pin the same thing twice!
      const alreadyPinned = state.find((repo) => repo.id === action.payload.id);
      if (!alreadyPinned) {
        state.push(action.payload);
      }
    },

    unpinRepo: (state, action) => {
      // action.payload will just be the ID of the repo we want to remove.
      // We filter the array to keep everything EXCEPT the one the user clicked.
      return state.filter((repo) => repo.id !== action.payload);
    },
  },
});

// Export the actions so our buttons can use them later
export const { pinRepo, unpinRepo } = pinnedReposSlice.actions;

// Export the reducer so the Main Store can use it
export default pinnedReposSlice.reducer;
