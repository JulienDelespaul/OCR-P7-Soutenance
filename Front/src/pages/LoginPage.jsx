import LoginPageSplashText from "../components/LoginPageComponents/LoginPageSplashText";
import LoginPageForm from "../components/LoginPageComponents/LoginPageForm";
import CreateAccountForm from "../components/LoginPageComponents/CreateAccountForm";
import { useState } from "react";

const LoginPage = () => {
	// switch beetwen login and create account;
	const [createAccountForm, setCreateAccountForm] = useState(false);
	const toggleAccountForm = () => {
		setCreateAccountForm(!createAccountForm);
	};

	return (
		<div>
			<div className="container flex flex-col lg:flex-row mx-auto items-center lg:mt-[10%] lg:items-start px-2 w-full">
				<LoginPageSplashText />
				{!createAccountForm ? <LoginPageForm toggleAccountForm={toggleAccountForm} /> : <CreateAccountForm toggleAccountForm={toggleAccountForm} />}
			</div>
		</div>
	);
};

export default LoginPage;
