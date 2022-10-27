import { useEffect, useState } from "react";
import axios from "../../Api/axios";
import useAuth from "../../hooks/useAuth";
import usePostsRefresh from "../../hooks/usePostsRefresh";

// like button component
const LikeButton = ({ post }) => {
	const [isLiked, setIsLiked] = useState();
	const { auth } = useAuth();
	const { setRefresh } = usePostsRefresh();

	// check if the post is liked by the user and set the state
	const userLike = post.usersLiked.includes(auth.userId);
	useEffect(() => {
		setIsLiked(userLike);
	}, [userLike]);

	// like or unlike the post
	const handleLike = async () => {
		setIsLiked(!isLiked);
		const formatedUserLike = isLiked ? 0 : 1;
		const id = post._id;
		const userId = auth.userId;
		// update the post in the database
		try {
			const response = await axios.post(`/post/${id}/like`, { userId, like: formatedUserLike }, { headers: { Authorization: `Bearer ${auth.token}` } });
			console.log(response.data);
			// refresh the posts
			setRefresh(true);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<button
			onClick={handleLike}
			className={isLiked ? "transition-all fill-primary hover:scale-125 active:scale-90" : " hover:scale-125 active:scale-90 transition-all"}
		>
			<svg className="w-8 h-6 flex-shrink" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 179.006 179.006">
				<path d="M5.096,94.473h23.987v60.54H5.096V94.473z M95.082,40.079v49.125h36.553v60.54 l-11.796,11.796H82.504l-23.587-12.19H34.172v-48.356h24.745l23.969-60.922L95.082,40.079L95.082,40.079z M34.178,95.923v-1.432 c0-2.816-2.279-5.096-5.096-5.096H5.096C2.285,89.396,0,91.675,0,94.491v60.54c0,2.816,2.279,5.096,5.096,5.096h23.987 c2.81,0,5.096-2.279,5.096-5.096v-0.65h23.474l22.567,11.713c0.71,0.364,1.498,0.543,2.291,0.537h37.329 c1.36,0,2.643-0.537,3.604-1.492l11.796-11.797c0.967-0.961,1.504-2.261,1.492-3.61v-60.54c0-2.81-2.446-5.078-5.245-5.078  h-31.314V40.061c0-2.81-2.273-5.096-5.09-5.096c-0.054,0-0.113,0-0.155,0h-12.19c-2.041,0.06-3.843,3.192-4.583,5.09 l-22.68,55.862" />
				<path d="M173.916,12.375H16.439c-2.81,0-5.096,2.279-5.096,5.096v68.601h5.096V17.471h157.478v107.941 h-33.719v5.09h33.719c2.816,0,5.09-2.279,5.09-5.09V17.471C179.006,14.655,176.733,12.375,173.916,12.375z" />
			</svg>
		</button>
	);
};

export default LikeButton;
