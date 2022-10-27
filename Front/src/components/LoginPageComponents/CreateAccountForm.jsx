import "../Button/button.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useContext, useEffect, useState } from "react";
import axios from "../../Api/axios";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const SIGNUP_URL = "/auth/signup";

// Validation schema
const validationSchema = Yup.object().shape({
	email: Yup.string().email("Cet email n'est pas valide.").required("L'email est obligatoire."),
	password: Yup.string()
		.required("Le mot de passe est obligatoire.")
		.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre."),
	confirmPassword: Yup.string()
		.required("La confirmation du mot de passe est obligatoire.")
		.oneOf([Yup.ref("password"), null], "Les mots de passe ne correspondent pas."),
});

// register form component
const CreateAccountForm = (props) => {
	useEffect(() => {
		document.getElementById("email").focus();
	}, []);

	const navigate = useNavigate();
	const { setAuth } = useContext(AuthContext);
	const [success, setSuccess] = useState(false);

	// handle form submit, if successful, also login user
	const handleInput = async (data) => {
		try {
			const response = await axios.post(SIGNUP_URL, { email: data.email, password: data.password });
			console.log(JSON.stringify(response?.data));
			if (response?.data) {
				try {
					const response = await axios.post("/auth/login", { email: data.email, password: data.password });
					const { token, userId } = response?.data;
					console.log(JSON.stringify(response?.data));
					const role = response?.data?.role;
					setAuth({ userId, token, role });
					setSuccess(true);
				} catch (error) {
					console.log(error);
					console.log(error.response?.data);
				}
			}
		} catch (error) {
			console.log(error);
			console.log(error.response?.data);
		}
	};

	const timedRedirect = () => {
		setTimeout(() => {
			navigate("/posts");
		}, 3000);
	};

	// react hook form setup
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(validationSchema), mode: "onChange" });

	// back button handler
	const HandleBackButton = (e) => {
		e.preventDefault();
		props.toggleAccountForm();
	};

	return (
		<div className="p-4 lg:w-[35%] max-w-md border-2 border-primary border-b-8 border-r-8 rounded-2xl text-xl">
			{success ? (
				// if register is successful, display success message, then redirect to posts page
				<div>
					<h1 className="text-lg font-bold text-center">Votre compte a bien été créé.</h1>
					<p className="text-lg text-center">Vous êtes désormais connecté et vous allez être redirigé vers la page d'accueil.</p>
					{timedRedirect()}
				</div>
			) : (
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
						<p aria-live="assertive">{errors.email?.message}</p>
					</div>
					<div className="py-2">
						<label htmlFor="name">Votre mot de passe</label>
						<input className="pl-1 border-2 border-primary w-full" type="password" id="password" name="password" {...register("password")} />
						<p>{errors.password?.message}</p>
						<label htmlFor="name">Confirmez votre mot de passe</label>
						<input className="pl-1 border-2 border-primary w-full" type="password" id="password" name="confirmPassword" {...register("confirmPassword")} />
						<p aria-live="assertive">{errors.confirmPassword?.message}</p>
					</div>

					<div className="flex flex-row justify-between pt-4 pb-2 text-lg">
						{/* back button */}
						<button className="text-base brutal-btn" onClick={HandleBackButton} type="button">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
						</button>
						{/* submit button */}
						<button type="submit" className="text-base brutal-btn">
							Créer votre compte
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default CreateAccountForm;
