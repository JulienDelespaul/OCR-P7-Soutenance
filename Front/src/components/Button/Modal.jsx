import { useState } from "react";
import Edit from "./EditPost.jsx";
import PostsPageEditPost from "../PostsPageComponents/PostsPageEditPost.jsx";

// edit post modal
const Modal = ({ post }) => {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<Edit setShowModal={setShowModal} />
			{showModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
						<div className="relative w-10/12 max-h-screen  mx-auto max-w-3xl">
							<div className="border-2 border-tertiary  border-b-8 border-r-8 rounded-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none px-4">
								<div className="flex items-start justify-between text-lg py-2 border-b border-solid border-slate-200 rounded-t">
									<h3 className="font-semibold">Modifier le post</h3>
									<button
										className="text-primary background-transparent font-bold uppercase text-sm pt-1 outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowModal(false)}
									>
										Fermer
									</button>
								</div>
								<PostsPageEditPost setShowModal={setShowModal} post={post} />
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</>
	);
};

export default Modal;
