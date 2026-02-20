


// // hooks/useAdmin.js
// import { useEffect, useState  , useCallback } from 'react';
// import AdminServices from '../api/AdminServices';

// const useAdmin = (API_URL) => {


//   // Check sessionStorage on initial load
//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     return sessionStorage.getItem('isLoggedIn') === 'true';
//   });
//   const [token, setToken] = useState(() => {
//     return sessionStorage.getItem('token');
//   });

//   //state for sessions

//   // const [recentsessions, setRecentSessions] = useState([]);
//   // const [allsessions, setallSessions] = useState([]);
//   // const [sessionTotal, SetSessionsTotal] = useState(0);
//   // const [sessionLoading, setSessionLoading] = useState(false);
  

//   // JWT sessions
//   const [recentJwtSessions, setRecentJwtSessions] = useState([]);
//   const [jwtLoading, setJwtLoading] = useState(false);
//   const [jwtSessions, setJwtSessions] = useState([]);
//   const [jwtTotal, setJwtTotal] = useState(0);


//   // State for user data
//   const [users, setUsers] = useState([]);
  
//   const [error, setError] = useState("");
//   const [isLoading, setLoading] = useState(false);
//   //  const [token, setToken] = useState(null);
  


//   useEffect(() => {
//     if (isLoggedIn && token) {
//       fetchData(token);
//     }
//   }, [])

//   const handleLogin = async (username, password) => {
//     setError("");
//     setLoading(true);
//     try {
//       const data = await AdminServices.login(API_URL, username, password);
//       if (data.access_token) {
//     sessionStorage.setItem('token', data.access_token);
//     sessionStorage.setItem('isLoggedIn', 'true');
    
//     setToken(data.access_token);
//     setIsLoggedIn(true);
    
//     await fetchData(data.access_token);
// }
// else {
//         setError(data.detail || "Login failed");
//       }
//     } catch (err) {
//       setError("Server error");
//       console.error("Login error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
// const handleLogout = () => {
//   sessionStorage.removeItem('token');
//   sessionStorage.removeItem('isLoggedIn');
//   setToken(null);
//   setIsLoggedIn(false);  // ✅ instantly tells App.jsx user is logged out
// };


//   // const fetchData = async (authToken) => {
//   //   setLoading(true);
//   //   try {
//   //     const [usersData, sessionsData, jwtSessionsData] = await Promise.all([
//   //       AdminServices.fetchUsers(API_URL, authToken),
//   //       AdminServices.fetchSessions(API_URL, authToken),
//   //       AdminServices.fetchJwtSessions(API_URL, authToken)
//   //     ]);

//   //     console.log("Fetched JWT Sessions:", jwtSessionsData);

//   //     setUsers(usersData);
//   //     setallSessions(sessionsData);
//   //     setAllJwtSessions(jwtSessionsData);

//   //     // Get recent 10 sessions (most recent first)
//   //     const recentjwtSessions = jwtSessionsData.slice(-10).reverse();
//   //     setRecentJwtSessions(recentjwtSessions);

//   //     const recentsessions = sessionsData.slice(-10).reverse();
//   //     setrecentSessions(recentsessions);

//   //     console.log("useAdmin: Recent JWT Sessions set:", recentsessions);
//   //     console.log("useAdmin: All JWT Sessions set:", jwtSessionsData);

//   //   } catch (err) {
//   //     console.error("Error fetching data:", err);
//   //     setError("Failed to fetch data");

//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };  

//   //jas

//   const fetchData = async (authToken) => {
//     setLoading(true);
//     try {
//       const [usersData, recentJwtsessions] = await Promise.all([
//         AdminServices.fetchUsers(API_URL, authToken),
//       //  AdminServices.fetchrecentSessions(API_URL, authToken),
//         AdminServices.fetchrecentJwtSessions(API_URL, authToken, 0, 10),
//       ]);

//       setUsers(usersData);

//       // FIXED: Handle response format consistently
//       if (recentJwtsessions.data && Array.isArray(recentJwtsessions.data)) {
//         setRecentJwtSessions(recentJwtsessions.data);
//       } else if (Array.isArray(recentJwtsessions)) {
//         setRecentJwtSessions(recentJwtsessions);
//       }

//       // if (recentsessionsData.data && Array.isArray(recentsessionsData.data)) {
//       //   setRecentSessions(recentsessionsData.data);
//       // } else if (Array.isArray(recentsessionsData)) {
//       //   setRecentSessions(recentsessionsData);
//       // }

//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

// //    const monthlyLoginFetcher = useCallback(
// //     async (year, month, source = "grid") => {
// //       if (!token) throw new Error("Not authenticated");
// //       return await AdminServices.fetchMonthlyLogins(API_URL, token, year, month, source);
// //     },
// //     [API_URL, token]
// //   );
// //  const fetchSessionsPage = useCallback(async (page, rowsPerPage) => {
// //     if (!token) return;

// //     setSessionLoading(true);
// //     try {
// //       const skip = page * rowsPerPage;
// //       const sessionsData = await AdminServices.fetchSessionsPaginated(API_URL, token, skip, rowsPerPage);
// //       if (sessionsData.data && Array.isArray(sessionsData.data)) {
// //         setallSessions(sessionsData.data);
// //         SetSessionsTotal(sessionsData.total || 0);

// //       } else if (Array.isArray(sessionsData)) {
// //         setallSessions(sessionsData);
// //         SetSessionsTotal(sessionsData.length);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching sessions page:", error);
// //       setError("Failed to fetch sessions");
// //       SetSessionsTotal(0);
// //       setallSessions([]);

// //     } finally {
// //       setSessionLoading(false);
// //     }
// //   }, [API_URL, token]);

//   const fetchJwtSessionsPage = useCallback(async (page, rowsPerPage) => {
//     if (!token) return;

//     console.log(`Fetching JWT sessions page ${page} with ${rowsPerPage} rows per page`);
//     setJwtLoading(true);

//     try {
//       const skip = page * rowsPerPage;
//       const jwtSessionsData = await AdminServices.fetchJwtSessionsPaginated(API_URL, token, skip, rowsPerPage);

//       console.log("Fetched JWT Sessions Page:", jwtSessionsData);

//       // Handle different response formats from your backend
//       if (jwtSessionsData.data && Array.isArray(jwtSessionsData.data)) {
//         setJwtSessions(jwtSessionsData.data);
//         setJwtTotal(jwtSessionsData.total || 0);
//       } else if (Array.isArray(jwtSessionsData)) {
//         setJwtSessions(jwtSessionsData);
//         setJwtTotal(jwtSessionsData.length);
//       } else {
//         console.error("Unexpected JWT sessions data format:", jwtSessionsData);
//         setJwtSessions([]);
//         setJwtTotal(0);
//       }
//     } catch (err) {
//       console.error("Error fetching JWT sessions page:", err);
//       setError("Failed to fetch JWT sessions");
//       setJwtSessions([]);
//       setJwtTotal(0);
//     } finally {
//       setJwtLoading(false);
//     }
//   }, [API_URL, token]);
//   //jas

//   const handleToggleBlock = async (username, block) => {
//     try {
//       console.log("Toggling block for:", username, "block:", block);
//       // FIX: Correct parameter order - API_URL, token, username, block
//       await AdminServices.toggleBlock(API_URL, token, username, block);
//       console.log("Block toggle successful, fetching updated users...");
//       const updatedUsers = await AdminServices.fetchUsers(API_URL, token);
//       setUsers(updatedUsers);
//       console.log("Updated users fetched successfully");
//     } catch (err) {
//       console.error("Error toggling block:", err);
//       setError(`Failed to toggle user block status: ${err.message}`);
//     }
//   };

//   const handleRevokeSession = async (sessionId) => {
//     try {
//       console.log("Revoking session:", sessionId);
//       await AdminServices.revokeSession(API_URL, token, sessionId);

//       // FIXED: Refetch recent JWT sessions for dashboard
//       const updatedRecentJwtSessions = await AdminServices.fetchrecentJwtSessions(API_URL, token, 0, 10);
//       if (updatedRecentJwtSessions.data && Array.isArray(updatedRecentJwtSessions.data)) {
//         setRecentJwtSessions(updatedRecentJwtSessions.data);
//       } else if (Array.isArray(updatedRecentJwtSessions)) {
//         setRecentJwtSessions(updatedRecentJwtSessions);
//       }

//       // FIXED: Also update the paginated view if it's currently loaded
//       if (jwtSessions.length > 0) {
//         // Trigger a refetch of the current page
//         // The component will handle this through the useEffect in JwtSessionsTable
//         console.log("Session revoked, data will be refreshed automatically");
//       }

//     } catch (err) {
//       console.error("Error revoking session:", err);
//       setError("Failed to revoke session");
//     }
//   };


//   return {
    
//   isLoggedIn,
//   users,
//   // recentsessions,
//   // allsessions,
//   error,
//   isLoading,
//   handleLogin,
//   handleLogout,
//   toggleBlock: handleToggleBlock,
//   handleRevokeSession,
//   jwtSessions,
//   recentJwtSessions,
//   jwtTotal,
//   fetchJwtSessionsPage,
//   jwtLoading,
//   // Removed fetchSessionsPage, sessionTotal, sessionLoading as requested
//   //monthlyLoginFetcher
//   };
// };

// export default useAdmin;




// hooks/useAdmin.js
import { useEffect, useState  , useCallback } from 'react';
import AdminServices from '../api/AdminServices';

const useAdmin = (API_URL) => {


  // Check sessionStorage on initial load
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('token');
  });

 

  // JWT sessions
  const [recentJwtSessions, setRecentJwtSessions] = useState([]);
  const [jwtLoading, setJwtLoading] = useState(false);
  const [jwtSessions, setJwtSessions] = useState([]); // All sessions for charts
  const [tableJwtSessions, setTableJwtSessions] = useState([]); // Paginated sessions for table
  const [jwtTotal, setJwtTotal] = useState(0);


  // State for user data
  const [users, setUsers] = useState([]);
  
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  //  const [token, setToken] = useState(null);
  


  useEffect(() => {
    if (isLoggedIn && token) {
      fetchData(token);
    }
  }, [isLoggedIn, token]) // Removed fetchData from dependencies to prevent infinite loop

  const handleLogin = async (username, password) => {
    setError("");
    setLoading(true);
    try {
      const data = await AdminServices.login(API_URL, username, password);
      if (data.access_token) {
    sessionStorage.setItem('token', data.access_token);
    sessionStorage.setItem('isLoggedIn', 'true');
    
    setToken(data.access_token);
    setIsLoggedIn(true);
    
    await fetchData(data.access_token);
}
else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Server error");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };
const handleLogout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('isLoggedIn');
  setToken(null);
  setIsLoggedIn(false);  // ✅ instantly tells App.jsx user is logged out
};



  const fetchData = async (authToken) => {
    setLoading(true);
    try {
      console.log('Fetching data with token:', authToken);
      const [usersData, recentJwtsessions, allJwtSessions] = await Promise.all([
        AdminServices.fetchUsers(API_URL, authToken),
        AdminServices.fetchrecentJwtSessions(API_URL, authToken, 0, 10),
        AdminServices.fetchJwtSessionsPaginated(API_URL, authToken, 0, 500)  // Increased from 100 to 500 to get more sessions
      ]);

      console.log('Fetched users data:', usersData);
      setUsers(Array.isArray(usersData) ? usersData : []);

      // Handle recent JWT sessions
      if (recentJwtsessions.data && Array.isArray(recentJwtsessions.data)) {
        setRecentJwtSessions(recentJwtsessions.data);
        console.log('Set recent JWT sessions from data property:', recentJwtsessions.data);
      } else if (Array.isArray(recentJwtsessions)) {
        setRecentJwtSessions(recentJwtsessions);
        console.log('Set recent JWT sessions from array:', recentJwtsessions);
      }

      // Handle all JWT sessions
      if (allJwtSessions.data && Array.isArray(allJwtSessions.data)) {
        console.log('Setting JWT sessions from data property:', allJwtSessions.data);
        setJwtSessions(allJwtSessions.data);
        setJwtTotal(allJwtSessions.total || 0);
      } else if (Array.isArray(allJwtSessions)) {
        console.log('Setting JWT sessions from array:', allJwtSessions);
        setJwtSessions(allJwtSessions);
        setJwtTotal(allJwtSessions.length);
      } else {
        console.error('Unexpected JWT sessions format:', allJwtSessions);
      }

      // if (recentsessionsData.data && Array.isArray(recentsessionsData.data)) {
      //   setRecentSessions(recentsessionsData.data);
      // } else if (Array.isArray(recentsessionsData)) {
      //   setRecentSessions(recentsessionsData);
      // }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };


  const fetchJwtSessionsPage = useCallback(async (page, rowsPerPage) => {
    if (!token) return;

    console.log(`Fetching JWT sessions page ${page} with ${rowsPerPage} rows per page`);
    setJwtLoading(true);

    try {
      const skip = page * rowsPerPage;
      const jwtSessionsData = await AdminServices.fetchJwtSessionsPaginated(API_URL, token, skip, rowsPerPage);

      console.log("Fetched JWT Sessions Page:", jwtSessionsData);

      // Handle different response formats from your backend
      if (jwtSessionsData.data && Array.isArray(jwtSessionsData.data)) {
        setTableJwtSessions(jwtSessionsData.data); // Use tableJwtSessions for paginated data
        setJwtTotal(jwtSessionsData.total || 0);
      } else if (Array.isArray(jwtSessionsData)) {
        setTableJwtSessions(jwtSessionsData); // Use tableJwtSessions for paginated data
        setJwtTotal(jwtSessionsData.length);
      } else {
        console.error("Unexpected JWT sessions data format:", jwtSessionsData);
        setTableJwtSessions([]); // Use tableJwtSessions for paginated data
        setJwtTotal(0);
      }
    } catch (err) {
      console.error("Error fetching JWT sessions page:", err);
      setError("Failed to fetch JWT sessions");
      setJwtSessions([]);
      setJwtTotal(0);
    } finally {
      setJwtLoading(false);
    }
  }, [API_URL, token]);
  //jas

  const handleToggleBlock = async (username, block) => {
    try {
      console.log("Toggling block for:", username, "block:", block);
      // FIX: Correct parameter order - API_URL, token, username, block
      await AdminServices.toggleBlock(API_URL, token, username, block);
      console.log("Block toggle successful, fetching updated users...");
      const updatedUsers = await AdminServices.fetchUsers(API_URL, token);
      setUsers(updatedUsers);
      console.log("Updated users fetched successfully");
    } catch (err) {
      console.error("Error toggling block:", err);
      setError(`Failed to toggle user block status: ${err.message}`);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      console.log("Revoking session:", sessionId);
      await AdminServices.revokeSession(API_URL, token, sessionId);

      // Refetch recent JWT sessions for dashboard
      const updatedRecentJwtSessions = await AdminServices.fetchrecentJwtSessions(API_URL, token, 0, 10);
      if (updatedRecentJwtSessions.data && Array.isArray(updatedRecentJwtSessions.data)) {
        setRecentJwtSessions(updatedRecentJwtSessions.data);
      } else if (Array.isArray(updatedRecentJwtSessions)) {
        setRecentJwtSessions(updatedRecentJwtSessions);
      }

      // Update the main jwtSessions list for charts
      const updatedAllJwtSessions = await AdminServices.fetchJwtSessionsPaginated(API_URL, token, 0, 100);
      if (updatedAllJwtSessions.data && Array.isArray(updatedAllJwtSessions.data)) {
        setJwtSessions(updatedAllJwtSessions.data);
        setJwtTotal(updatedAllJwtSessions.total || 0);
      } else if (Array.isArray(updatedAllJwtSessions)) {
        setJwtSessions(updatedAllJwtSessions);
        setJwtTotal(updatedAllJwtSessions.length);
      }

      // Update the paginated table data as well
      // This ensures the JwtSessionsPage will show updated data immediately
      if (tableJwtSessions.length > 0) {
        // Re-fetch with the current pagination parameters
        // We'll estimate them based on the array length and total
        const estimatedLimit = Math.min(50, tableJwtSessions.length || 10); // Default to 10 if empty
        const estimatedSkip = Math.max(0, jwtTotal - estimatedLimit);
        
        const updatedTableJwtSessions = await AdminServices.fetchJwtSessionsPaginated(API_URL, token, estimatedSkip, estimatedLimit);
        if (updatedTableJwtSessions.data && Array.isArray(updatedTableJwtSessions.data)) {
          setTableJwtSessions(updatedTableJwtSessions.data);
        } else if (Array.isArray(updatedTableJwtSessions)) {
          setTableJwtSessions(updatedTableJwtSessions);
        }
        
        console.log("Session revoked, all data refreshed automatically");
      }

      return true; // Return success to allow chaining with .then()

    } catch (err) {
      console.error("Error revoking session:", err);
      setError("Failed to revoke session");
      throw err; // Re-throw to allow .catch() in the component
    }
  };




  return {
    isLoggedIn,
    users,
    error,
    isLoading,
    handleLogin,
    handleLogout,
    toggleBlock: handleToggleBlock,
    handleRevokeSession,
    jwtSessions, // Full list for charts
    tableJwtSessions, // Paginated list for tables
    recentJwtSessions,
    jwtTotal,
    fetchJwtSessionsPage,
    jwtLoading
  };
};

export default useAdmin;

