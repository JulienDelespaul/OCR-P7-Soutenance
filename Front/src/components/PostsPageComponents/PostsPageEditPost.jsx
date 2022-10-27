import "../Button/button.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "../../Api/axios";
import useAuth from "../../hooks/useAuth";
import usePostsRefresh from "../../hooks/usePostsRefresh";

//is used in the edit post modal, contains all the logic to edit a post
const PostsPageEditPost = ({ post, setShowModal }) => {
	const [image, setImage] = useState({ img: null, imgUrl: null });
	const [freshPost, setFreshPost] = useState(post);
	const { auth } = useAuth();
	const { setPostId, setRefresh } = usePostsRefresh();
	const id = post._id;

	// gets fresh post data from the server
	useEffect(() => {
		let isMounted = true;

		const getPost = async () => {
			try {
				const response = await axios.get(`/post/${id}`, {
					headers: {
						Authorization: `Bearer ${auth.token}`,
					},
				});
				const freshPostData = response.data;
				isMounted && setFreshPost(freshPostData);
				console.log("fresh post data", freshPostData);
			} catch (error) {
				console.log(error);
			}
		};
		getPost();

		return () => {
			isMounted = false;
		};
	}, [id, auth.token]);

	// handle form submit and put request
	const HandleInput = async (data) => {
		const formData = new FormData();
		formData.append("content", data.content);
		formData.append("image", image.img);
		try {
			const response = await axios.put(`/post/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${auth.token}`,
				},
			});
			console.log(response);
			// toggle refresh to trigger useEffect in Posts.jsx
			setRefresh(true);
			setPostId(id);
			reset();
			setImage({ img: null, imgUrl: null });
			setShowModal(false);
		} catch (error) {
			console.log(error);
		}
	};

	// handle image input
	const HandleImageSelection = (e) => {
		e.preventDefault();
		// display image from input
		if (e.target.files && e.target.files[0]) {
			let img = e.target.files[0];
			let imgUrl = URL.createObjectURL(img);
			setImage({ img, imgUrl });
			console.log("image state updated", image);
		}
		console.log(e.target.files[0]);
	};

	const { register, handleSubmit, reset } = useForm();

	return (
		<form onSubmit={handleSubmit(HandleInput)} className="w-full text-base flex flex-col justify-between object-top ">
			<textarea
				className="p-2 max-h-32 flex text-wrap bg-secondary text-tertiary  border-2 border-black resize-none"
				placeholder="..."
				type="text"
				name="content"
				defaultValue={freshPost.content}
				{...register("content")}
			></textarea>
			<div>{image.img && <img src={image.imgUrl} alt="preview" className="max-h-80 sm:h-96 lg:h-112 mt-4 mx-auto object-cover rounded-2xl" />}</div>
			<div>
				{freshPost.imageUrl && !image.img && (
					<img src={freshPost.imageUrl} alt="preview" className="max-h-80 sm:h-96 lg:h-112 mt-4 mx-auto object-cover rounded-2xl" />
				)}
			</div>
			<div className="flex justify-end text-base gap-2 py-2">
				<label className="brutal-btn cursor-pointer">
					{freshPost.imageUrl || image.imgUrl !== null ? <span>Changer d'image</span> : <span>Ajouter une image</span>}
					<input type="file" className="hidden" name="image" {...register("image")} onChange={HandleImageSelection} />{" "}
				</label>
				<button className="brutal-btn">Poster</button>
			</div>
		</form>
	);
};

export default PostsPageEditPost;
