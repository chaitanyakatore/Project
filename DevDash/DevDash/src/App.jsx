import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pinRepo, unpinRepo } from "./pinnedReposSlice";
import { useDebounce } from "./hooks/useDebounce";

// 1. IMPORT THE NEW THROTTLE HOOK
import { useThrottle } from "./hooks/useThrottle";

function App() {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. ADD PAGE STATE: Keep track of which page of results we are on
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query, 500);
  const dispatch = useDispatch();
  const pinnedRepos = useSelector((state) => state.pinnedRepos);

  // 3. RESET EFFECT: If the user types a brand new search, clear the old results and reset to page 1
  useEffect(() => {
    setRepos([]);
    setPage(1);
  }, [debouncedQuery]);

  // 4. API CALL EFFECT: Now it listens to BOTH debouncedQuery and page changes
  useEffect(() => {
    if (!debouncedQuery) return;

    const fetchRepos = async () => {
      setLoading(true);
      try {
        // Notice we added &page=${page} to tell GitHub which chunk of data we want
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${debouncedQuery}&page=${page}`,
        );
        const data = await response.json();

        // IMPORTANT: Instead of replacing the array, we ADD the new items to the end of the existing list!
        setRepos((prevRepos) => {
          // If we are on page 1, just set the new items. Otherwise, spread the old ones and append the new ones.
          return page === 1
            ? data.items || []
            : [...prevRepos, ...(data.items || [])];
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [debouncedQuery, page]);

  // 5. THE SCROLL LISTENER (Using our custom Throttle Hook)
  const handleScroll = useThrottle(() => {
    // Math to figure out if we hit the bottom of the page
    const windowHeight = window.innerHeight; // Height of what you can see
    const documentHeight = document.documentElement.scrollHeight; // Total height of the page
    const scrollTop = document.documentElement.scrollTop; // How far down you've scrolled

    // If how far you scrolled + what you can see is >= the total height of the page (minus a 100px buffer)...
    if (windowHeight + scrollTop >= documentHeight - 100) {
      // ...and we aren't already loading something...
      if (!loading) {
        // ...turn the page! (This triggers the useEffect above to fetch more data)
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, 500); // Only do this math check once every half second

  // 6. ATTACH THE LISTENER
  useEffect(() => {
    // Tell the browser to listen to scroll events
    window.addEventListener("scroll", handleScroll);

    // Cleanup: Stop listening if the component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      {/* LEFT COLUMN */}
      <div style={{ flex: 2 }}>
        <h2>GitHub Explorer</h2>
        <input
          type="text"
          placeholder="Search for repositories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        />

        <ul style={{ listStyle: "none", padding: 0 }}>
          {repos.map((repo, index) => (
            // We added '-${index}' to the key because GitHub's pagination occasionally returns a duplicate ID
            <li
              key={`${repo.id}-${index}`}
              style={{ borderBottom: "1px solid #ccc", padding: "15px 0" }}
            >
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  display: "block",
                }}
              >
                {repo.full_name}
              </a>
              <p style={{ margin: "5px 0" }}>
                ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
              </p>
              <button
                onClick={() => dispatch(pinRepo(repo))}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  marginTop: "5px",
                }}
              >
                📌 Pin Repo
              </button>
            </li>
          ))}
        </ul>

        {/* Visual indicator that infinite scroll is working */}
        {loading && (
          <p
            style={{ textAlign: "center", padding: "20px", fontWeight: "bold" }}
          >
            Loading more repos...
          </p>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          height: "fit-content",
          position: "sticky",
          top: "20px",
        }}
      >
        <h3>My Pinned Dashboard</h3>
        {pinnedRepos.length === 0 ? (
          <p>You haven't pinned anything yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {pinnedRepos.map((repo) => (
              <li
                key={repo.id}
                style={{
                  marginBottom: "15px",
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              >
                <strong>{repo.name}</strong>
                <br />
                <button
                  onClick={() => dispatch(unpinRepo(repo.id))}
                  style={{
                    marginTop: "10px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  ❌ Unpin
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
