// edit profile button
const EditProfile = ({ setShowProfileModal }) => {
	return (
		<button onClick={setShowProfileModal} className="p-2 flex items-baseline font-bold text-primary text-xl ">
			<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
	);
};

export default EditProfile;
