import "../Button/button.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../Api/axios";
import { useNavigate } from "react-router-dom";

const LOGIN_URL = "/auth/login";

const validationSchema = Yup.object().shape({
	email: Yup.string().email("Cet email n'est pas valide.").required("L'email est obligatoire."),
	password: Yup.string().required("Le mot de passe est obligatoire."),
});

const LoginPageForm = (props) => {
	const { setAuth } = useAuth();

	const navigate = useNavigate();

	// set focus on email input
	useEffect(() => {
		document.getElementById("email").focus();
	}, []);

	const [success, setSuccess] = useState(false);

	// handle form submit
	const handleInput = async (data) => {
		try {
			const response = await axios.post(LOGIN_URL, { email: data.email, password: data.password });
			console.log(JSON.stringify(response?.data));
			const { token, userId, email } = response?.data;
			const role = response?.data?.role;
			// set token in session storage and state
			setAuth({ userId, token, role });
			sessionStorage.setItem("auth", JSON.stringify({ userId, token, role, email }));
			setSuccess(true);
		} catch (error) {
			setError("invalidCredentials", { message: "Les identifiants sont incorrects." });
			console.log(error.response?.data);
		}
	};

	// react hook form setup
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({ resolver: yupResolver(validationSchema), mode: "onChange" });

	const timedRedirect = () => {
		setTimeout(() => {
			navigate("/posts");
		}, 1000);
	};

	return (
		<div className="p-4 lg:w-[35%] max-w-md border-2 border-black border-b-8 border-r-8 rounded-2xl text-xl">
			{success ? (
				// if login is successful, inform the user, then redirect to posts page
				<div>
					<h1 className="text-primary text-lg font-bold text-center">Vous êtes désormais connecté.</h1>
					<p className="text-primary text-lg text-center"> Vous allez être redirigé vers la page principale.</p>
					{timedRedirect()}
				</div>
			) : (
				// if login is needed, display the login form
				<form onSubmit={handleSubmit(handleInput)} noValidate>
					<div className="py-2">
						<label htmlFor="email">Votre adresse E-mail</label>
						<input
							onBlur={handleSubmit(handleInput)}
							className="pl-1 border-2 border-primary w-full"
							type="email"
							name="email"
							id="email"
							{...register("email")}
						/>
						<p>{errors.email?.message}</p>
					</div>
					<div className="py-2">
						<label htmlFor="name">Votre mot de passe</label>
						<input className="pl-1 border-2 border-primary w-full" type="password" id="password" name="password" {...register("password")} />
						<p>{errors.password?.message}</p>
						<p> {errors.invalidCredentials?.message}</p>
					</div>

					<div className="py-2">
						<button className="text-base brutal-btn ">Vous connecter</button>
					</div>
					<div className="pt-4 pb-2 text-lg">
						{/* switch to register form */}
						<p>Vous n'avez pas de compte ?</p>
						<button className="text-base brutal-btn" onClick={props.toggleAccountForm}>
							Créer un compte
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default LoginPageForm;
