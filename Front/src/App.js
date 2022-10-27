import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import useAuth from "./hooks/useAuth";
import RequireAuth from "./components/RequireAuth";
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostsPage";
import Unauthorized from "./pages/UnauthorizedPage";

function App() {
	const { setAuth } = useAuth();
	const navigate = useNavigate();

	// This is a hack to get around the fact that the server doesn't send a 401 when the token is invalid.
	useEffect(() => {
		const authExistsInLocalStorage = sessionStorage.getItem("auth");
		if (authExistsInLocalStorage) {
			const userAuth = authExistsInLocalStorage;
			console.log("userAuth", userAuth);
			setAuth({ ...JSON.parse(userAuth) });
			// redirect to posts page
			navigate("/posts");
		}
	}, []);

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/* Public routes */}
				<Route path="login" element={<LoginPage />} />
				{/* Private routes */}
				<Route element={<RequireAuth allowedRoles={["user", "admin"]} />}>
					<Route path="posts" element={<PostsPage />} />
				</Route>
				' {/* Unauthorized routes */}'
				<Route path="unauthorized" element={<Unauthorized />} />
				{/* Redirect to login page */}
				<Route path="/" element={<LoginPage />} />
			</Route>
		</Routes>
	);
}

export default App;
