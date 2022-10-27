import { useState } from "react";
import EditProfile from "./EditProfile.jsx";
import ProfilePage from "../ProfilePageComponents/ProfilePageContent.jsx";
import useLogout from "../../hooks/useLogout";
import "../Button/button.css";

// user profile and logout modal
const ProfileModal = () => {
	const [showProfileModal, setShowProfileModal] = useState(false);
	const { handleLogout } = useLogout();
	return (
		<>
			<EditProfile setShowProfileModal={setShowProfileModal} />
			{showProfileModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
						<div className="relative w-10/12 max-h-screen  mx-auto max-w-3xl">
							<div className="h-max mt-4 w-full flex flex-col p-4 object-top border-2 border-tertiary border-b-8 border-r-8 rounded-2xl bg-white">
								<div className="flex flex-row justify-between">
									<h1 className="text-primary text-xl pb-1">Profil de l'utilisateur </h1>
									{/* close button */}
									<button className="brutal-btn" onClick={() => setShowProfileModal(false)}>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
								{/* profile page */}
								<ProfilePage setShowModal={setShowProfileModal} />
								<button className="brutal-btn" onClick={handleLogout}>
									Déconnexion
								</button>
							</div>
						</div>
					</div>

					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</>
	);
};

export default ProfileModal;
