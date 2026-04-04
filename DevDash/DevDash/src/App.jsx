// 1. IMPORT THE HOOK at the top
import { useState, useEffect } from "react";
import { useDebounce } from "./hooks/useDebounce";

function App() {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. USE THE HOOK: Create a delayed version of whatever is in the search box
  const debouncedQuery = useDebounce(query, 500); // 500 milliseconds = half a second

  // 3. CHANGE THE DEPENDENCY:
  // Tell useEffect to listen to the 'debouncedQuery' INSTEAD of the raw 'query'
  useEffect(() => {
    if (!debouncedQuery) {
      setRepos([]);
      return;
    }

    const fetchRepos = async () => {
      setLoading(true);
      try {
        // Notice we changed ${query} to ${debouncedQuery} here too!
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${debouncedQuery}`,
        );
        const data = await response.json();
        setRepos(data.items || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [debouncedQuery]); // <-- Look here! We changed this from [query] to [debouncedQuery]

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>DevDash - GitHub Explorer</h2>

      {/* The input still updates the raw 'query' instantly so the UI feels fast */}
      <input
        type="text"
        placeholder="Search for repositories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />

      {loading && <p>Loading...</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {repos.map((repo) => (
          <li
            key={repo.id}
            style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
          >
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "18px", fontWeight: "bold" }}
            >
              {repo.full_name}
            </a>
            <p style={{ margin: "5px 0" }}>
              ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
