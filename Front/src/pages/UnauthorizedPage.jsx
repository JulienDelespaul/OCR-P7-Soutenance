import { useNavigate } from "react-router-dom";
import LoginPageSplashText from "../components/LoginPageComponents/LoginPageSplashText";


// is used when the user is not logged in and tries to access a page that requires authentication
// displya a message to inform the user then redirects to login page
const UnauthorizedPage = () => {
	const navigate = useNavigate();
	const timedRedirect = () => {
		setTimeout(() => {
			navigate("/login");
		}, 2000);
	};

	return (
		<div className="container flex flex-col items-center mx-auto justify-between lg:px-10 px-2">
			<LoginPageSplashText />
			<div className="mt-4 p-4 w-full border-2 border-black border-b-8 border-r-8 rounded-2xl text-xl max-w-[60%]">
				<h1 className="text-primary text-lg font-bold text-center">Désolé !</h1>
				<p className=" text-lg text-left">Vous n'avez pas l'autorisation nécessaire pour accéder à ce contenu.</p>
				<p className="text-lg text-left">Vous allez être redirigé vers la page de connexion.</p>
				{timedRedirect()}
			</div>
		</div>
	);
};

export default UnauthorizedPage;
