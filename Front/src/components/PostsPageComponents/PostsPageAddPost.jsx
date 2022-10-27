import "../Button/button.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../../Api/axios";
import useAuth from "../../hooks/useAuth";
import usePostsRefresh from "../../hooks/usePostsRefresh";

const POST_URL = "/post";

// add post component
const PostsPageAddPost = () => {
	const [image, setImage] = useState({ img: null, imgUrl: null });
	const { auth } = useAuth();
	const { setPostId, postId, setRefresh } = usePostsRefresh();

	// handle form submit and post request
	const HandleInput = async (data) => {
		const formData = new FormData();
		formData.append("image", image.img);
		formData.append("content", data.content);
		try {
			const response = await axios.post(POST_URL, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${auth.token}`,
				},
			});
			console.log("response", response);
			// toggle refresh to trigger useEffect in Posts.jsx
			setRefresh(true);
			setPostId(response.data);
			console.log(postId);
			reset();
			setImage({ img: null, imgUrl: null });
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
			console.log(image);
		}
		console.log(e.target.files[0]);
	};

	// reset form
	const HandleReset = (e) => {
		e.preventDefault();
		setImage({ img: null, imgUrl: null });
		reset();
	};

	// react hook form setup
	const { register, handleSubmit, reset, formState } = useForm({
		defaultValues: {
			content: "",
		},
	});

	return (
		<form
			onSubmit={handleSubmit(HandleInput)}
			className="h-min  w-full text-lg flex flex-col justify-between object-top border-2 border-tertiary border-b-8 border-r-8 rounded-2xl "
		>
			<div className="flex flex-row justify-between p-2">
				<label className=" pt-2 pb-1 font-bold text-base text-primary">Exprimez-vous !</label>
				{/* display the reset button if the form is not dirty */}
				{image?.img || formState.isDirty ? (
					<button className="border-2 border-primary text-primary px-1" onClick={HandleReset}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				) : null}
			</div>
			<textarea
				className="px-2 mx-2 h-16 flex text-base text-wrap bg-secondary text-tertiary resize-none"
				placeholder="..."
				type="text"
				name="content"
				{...register("content")}
			/>
			<div>{image.img && <img src={image.imgUrl} alt="preview" className="max-h-80 sm:h-96 lg:h-112 mt-4 mx-auto object-cover rounded-2xl px-2" />}</div>
			<div className="flex justify-end m-2 mr-4 mb-4 text-base gap-2 ">
				<label className="brutal-btn  cursor-pointer">
					{image?.img ? <span>Changer d'image</span> : <span>Ajouter une image</span>}
					<input type="file" className="hidden" name="image" {...register("image")} onChange={HandleImageSelection} />{" "}
				</label>
				<button className="brutal-btn ">Poster</button>
			</div>
		</form>
	);
};

export default PostsPageAddPost;
