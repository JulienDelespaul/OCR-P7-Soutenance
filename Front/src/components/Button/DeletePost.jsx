import usePostsRefresh from "../../hooks/usePostsRefresh";
import useAuth from "../../hooks/useAuth";
import "../Button/button.css";
import axios from "../../Api/axios";

// delete post button component
const DeletePost = ({ post }) => {
	const { setPostId, setRefresh } = usePostsRefresh();
	const { auth } = useAuth();

	const deletePost = async () => {
		const id = post._id;
		try {
			await axios.delete(`/post/${id}`, { headers: { Authorization: `Bearer ${auth.token}` } });
			setRefresh(true);
			setPostId(id);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<button onClick={deletePost} className="brutal-btn">
			Supprimer
		</button>
	);
};

export default DeletePost;
