import ProfileModal from "../Button/profileModal";
import useAuth from "../../hooks/useAuth";

const PostsPageHeader = () => {
	const { auth } = useAuth();

	return (
		<div className="flex justify-between z-10 items-center w-full sticky top-0 bg-white">
			<div className="mb-2 w-full flex justify-between items-center object-top border-2 text-tertiary border-primary border-b-8 border-r-8 rounded-2xl ">
				{/* adds "admin" in the header when the user is an admin */}
				{auth.role === "admin" ? (
					<h1 className="p-2 flex items-baseline font-bold text-primary text-xl ">Groupomania (ADMINISTRATEUR)</h1>
				) : (
					<h1 className="p-2 flex items-baseline font-bold text-primary text-xl ">Groupomania</h1>
				)}
				{/* display a profile and disconnect modal */}
				<ProfileModal />
			</div>
		</div>
	);
};

export default PostsPageHeader;
