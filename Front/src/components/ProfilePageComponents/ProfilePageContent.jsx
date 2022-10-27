import "../Button/button.css";
import { useState, useEffect } from "react";
import axios from "../../Api/axios";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import usePostsRefresh from "../../hooks/usePostsRefresh";

// user profile and logout modal
const ProfilePage = (setShowProfileModal) => {
	const { auth } = useAuth();
	const { setRefresh } = usePostsRefresh();
	const [profile, setProfile] = useState({});
	const id = auth.userId;
	const [editProfile, setEditProfile] = useState(true);

	const { register, handleSubmit, reset, formState, setFocus } = useForm({});

	// get user profile data
	useEffect(() => {
		let isMounted = true;

		const getProfile = async () => {
			try {
				const response = await axios.get(`auth/profile/${id}`, { headers: { Authorization: `Bearer ${auth.token}` } });
				const profile = response.data;
				isMounted && setProfile(profile);
				reset(profile);
				console.log("profile", response.data);
			} catch (error) {
				console.log(error);
			}
		};
		getProfile();
		return () => {
			isMounted = false;
		};
	}, [id, auth.token, reset]);

	// handle form submit and put request
	const HandleInput = async (data) => {
		const formData = new FormData();
		formData.append("firstName", data.firstName);
		formData.append("lastName", data.lastName);
		formData.append("position", data.position);
		formData.append("department", data.department);
		formData.append("bio", data.bio);
		console.log("formData", formData);
		try {
			const response = await axios.put(`auth/profile/${id}`, formData, {
				headers: { Authorization: `Bearer ${auth.token}` },
			});
			console.log(response);
			setRefresh(true);
			reset(profile, { keepValues: true });
			setEditProfile(true);
		} catch (error) {
			console.log(error);
		}
	};

	// toggle "edit mode", input fields are enabled and cursor focus is set to the first input field
	const [focusTrigger, setFocusTrigger] = useState(false);

	const handleEdit = () => {
		setEditProfile(false);
		setFocusTrigger(!focusTrigger);
	};

	useEffect(() => {
		setFocus("firstName");
	}, [focusTrigger, setFocus]);

	return (
		<div className="h-max mt-4 pb-4 w-full flex flex-col  object-top ">
			<form onSubmit={handleSubmit(HandleInput)} className="flex flex-col gap-1">
				<div>
					<label className="text-primary" htmlFor="firstName">
						Prénom :{" "}
					</label>
					<input
						// Changes input background color if the input field is dirty
						className={"text-tertiary " + (formState.dirtyFields.firstName ? "bg-secondary" : "")}
						type="text"
						name="firstName"
						id="firstName"
						disabled={editProfile}
						{...register("firstName")}
					/>
				</div>
				<div>
					<label className="text-primary" htmlFor="lastName">
						Nom :{" "}
					</label>
					<input
						type="text"
						name="lastName"
						id="lastName"
						className={"text-tertiary " + (formState.dirtyFields.lastName ? "bg-secondary" : "")}
						disabled={editProfile}
						{...register("lastName")}
					/>
				</div>
				<div>
					<label className="text-primary" htmlFor="position">
						Poste :{" "}
					</label>
					<input
						type="text"
						name="position"
						id="position"
						className={"text-tertiary " + (formState.dirtyFields.position ? "bg-secondary" : "")}
						disabled={editProfile}
						{...register("position")}
					/>
				</div>
				<div>
					<label className="text-primary" htmlFor="department">
						Service :{" "}
					</label>
					<input
						type="text"
						name="department"
						id="department"
						className={"text-tertiary " + (formState.dirtyFields.department ? "bg-secondary" : "")}
						disabled={editProfile}
						{...register("department")}
					></input>
				</div>
				<label className="text-primary" htmlFor="bio">
					Bio :{" "}
				</label>
				<textarea
					name="bio"
					id="bio"
					rows="5"
					disabled={editProfile}
					{...register("bio")}
					className={"text-tertiary resize-none" + (formState.dirtyFields.bio ? "bg-secondary" : "")}
				/>
				{/* button to toggle edit mode */}
				{editProfile && (
					<button className="brutal-btn" type="button" onClick={handleEdit}>
						Modifier le profil
					</button>
				)}
				{/* button to submit form, only appears if the user has changed something */}
				{formState.isDirty && <button className="brutal-btn">Enregistrer les modifications</button>}
			</form>
		</div>
	);
};

export default ProfilePage;
