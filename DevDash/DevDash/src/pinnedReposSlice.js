// Line 1: We import the tool that helps us make a slice.
import { createSlice } from "@reduxjs/toolkit";

// Line 2: We create the slice and store it in a variable.
export const pinnedReposSlice = createSlice({
  // Line 3: We name this slice. It's like naming a folder.
  name: "pinnedRepos",

  // Line 4: The starting value. Before the user does anything, the pinned list is an empty array [].
  initialState: [],

  // Line 5: Reducers are the ONLY functions allowed to change the state.
  reducers: {
    // Line 6: Rule #1 - How to add a repo.
    // 'state' is the current array. 'action.payload' is the new data coming in.
    pinRepo: (state, action) => {
      state.push(action.payload); // We push the new repo into the array.
    },

    // Line 7: Rule #2 - How to remove a repo.
    unpinRepo: (state, action) => {
      // We filter the array to remove the specific ID the user clicked.
      return state.filter((repo) => repo.id !== action.payload);
    },
  },
});

// Line 8: We export the rules so our buttons can use them later.
export const { pinRepo, unpinRepo } = pinnedReposSlice.actions;

// Line 9: We export the whole slice so the main Store can use it.
export default pinnedReposSlice.reducer;
