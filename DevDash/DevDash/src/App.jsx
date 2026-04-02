// Line 1: Import the hooks we need.
// useSelector = Read data
// useDispatch = Write data
import { useSelector, useDispatch } from "react-redux";

// Line 2: Import the rules we wrote earlier.
import { pinRepo } from "./pinnedReposSlice";

function App() {
  // Line 3: Give me the remote control so I can send messages to the Store.
  const dispatch = useDispatch();

  // Line 4: Give me a camera so I can look at the Store and read the 'pinnedRepos' array.
  const myPinnedList = useSelector((state) => state.pinnedRepos);

  return (
    <div>
      {/* Line 5: When the user clicks this button... */}
      <button
        onClick={() => {
          // Line 6: Use the remote control (dispatch) to send the 'pinRepo' rule to the store,
          // passing along the specific repo data (the payload).
          dispatch(pinRepo({ id: 1, name: "React" }));
        }}
      >
        Pin this repo
      </button>

      {/* Line 7: Displaying the data we read from the camera (useSelector) */}
      <ul>
        {myPinnedList.map((repo) => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>
    </div>
  );
}
