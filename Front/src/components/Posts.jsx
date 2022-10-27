import { useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "../Api/axios";
import useAuth from "../hooks/useAuth";
import LikeButton from "./Button/LikeButton";
import Delete from "./Button/DeletePost";
import Modal from "./Button/Modal";
import ElapsedTime from "./Utilities/ElapsedTime";
import usePostsRefresh from "../hooks/usePostsRefresh";
import { useNavigate } from "react-router-dom";

// posts component
const Posts = () => {
	const { refresh, setRefresh } = usePostsRefresh();
	const { auth } = useAuth();
	const navigate = useNavigate();

	// get the posts from the database paginated, 5 posts per page, gets the next page when the user scrolls to the bottom of the page
	const { fetchNextPage, hasNextPage, isFetchingNextPage, data, refetch, error } = useInfiniteQuery(
		[`/posts`],
		async ({ pageParam = 1 }) => {
			const response = await axios.get(`/post/page/${pageParam}`, { headers: { Authorization: `Bearer ${auth.token}` } });
			return response.data;
		},
		{
			getNextPageParam: (lastPage, allPages) => {
				return lastPage.length ? allPages.length + 1 : undefined;
			},
		}
	);
	// failsafe to prevent the user from accessing the posts page if they are not logged in
	if (error) {
		sessionStorage.clear();
		navigate("/unauthorized");
	}

	// trigger a posts refetch from react query when the refresh state changes and reset the refresh state to false
	if (refresh) {
		refetch();
		setRefresh(false);
	}

	// infinite scroll logic
	const intObserver = useRef();
	const lastPostRef = useCallback(
		(post) => {
			if (isFetchingNextPage) return;

			if (intObserver.current) intObserver.current.disconnect();

			intObserver.current = new IntersectionObserver((posts) => {
				if (posts[0].isIntersecting && hasNextPage) {
					console.log("Dernier post");
					fetchNextPage();
				}
			});
			if (post) intObserver.current.observe(post);
		},
		[isFetchingNextPage, hasNextPage, fetchNextPage]
	);

	// display the posts
	const content = data?.pages.map((pg) => {
		return pg.map((post, i) => {
			if (pg.length === i + 1) {
				return (
					<li
						ref={lastPostRef}
						className="h-min mt-4 p-2 w-full flex flex-col justify-between object-top border-2 border-tertiary border-b-8 border-r-8 rounded-2xl"
						key={post._id}
					>
						<div className="flex flex-col justify-between">
							<div>
								{post.user.firstName} {post.user.lastName}
							</div>
							<div className="text-base">Il y a {ElapsedTime(post?.createdAt)}</div>
						</div>
						<div className="bg-secondary mt-2 p-4 border-tertiary border-2">{post?.content}</div>
						<div>{post?.imageUrl && <img src={post.imageUrl} alt="post" className="max-h-80 sm:h-96 lg:h-112  mt-4 mx-auto object-cover rounded-2xl" />}</div>
						<div className="flex justify-between mt-4">
							<div className="flex flex-row">
								<LikeButton post={post} />
								{post.likes !== 0 && <p className="pl-2">{post.likes}</p>}
							</div>
							{/* display modify and delete buttons only if the user is the author of the post or is an admin */}
							<div className="flex flex-row gap-x-4  ">
								<div className="flex flex-row ">{(post.userId === auth.userId || auth.role === "admin") && <Modal post={post} />}</div>
								<div className="flex flex-row ">{(post.userId === auth.userId || auth.role === "admin") && <Delete post={post} />}</div>
							</div>
						</div>
					</li>
				);
			}
			return (
				<li
					className="h-min mt-2 p-2 w-full flex flex-col justify-between object-top border-2 border-tertiary border-b-8 border-r-8 rounded-2xl"
					key={post._id}
				>
					<div className="flex flex-col justify-between">
						<div>
							{post.user.firstName} {post.user.lastName}
						</div>
						<div>Il y a {ElapsedTime(post?.createdAt)}</div>
					</div>
					<div className="bg-secondary mt-2 p-4 border-tertiary border-2">{post?.content}</div>
					<div>{post?.imageUrl && <img src={post.imageUrl} alt="post" className="max-h-80 sm:h-96 lg:h-112 mt-4 mx-auto object-cover rounded-2xl" />}</div>
					<div className="flex justify-between mt-4">
						<div className="flex flex-row pb-2 self-center">
							<LikeButton post={post} />
							{post.likes !== 0 && <p className="pl-2">{post.likes}</p>}
						</div>
						{/* display modify and delete buttons only if the user is the author of the post or is an admin */}
						<div className="flex flex-row pr-2 pb-2 gap-x-4  ">
							<div className="flex flex-row ">{(post.userId === auth.userId || auth.role === "admin") && <Modal post={post} />}</div>
							<div className="flex flex-row ">{(post.userId === auth.userId || auth.role === "admin") && <Delete post={post} />}</div>
						</div>
					</div>
				</li>
			);
		});
	});

	return (
		<article className="text-tertiary text-base w-full">
			<h2 className="h-min mt-2 p-2 border-2 text-primary font-bold text-xl border-primary border-b-8 border-r-8 rounded-2xl">Contributions</h2>
			<ul className="flex flex-col ">{content}</ul>
			{isFetchingNextPage && <p className="text-primary">Chargement...</p>}
		</article>
	);
};

export default Posts;
