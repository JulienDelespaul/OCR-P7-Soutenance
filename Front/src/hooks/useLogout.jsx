import useAuth from "./useAuth";

const useLogout = () => {
	const { setAuth } = useAuth();

	const handleLogout = () => {
		setAuth({});
		sessionStorage.removeItem("auth");
	};

	return { handleLogout };
};

export default useLogout;
