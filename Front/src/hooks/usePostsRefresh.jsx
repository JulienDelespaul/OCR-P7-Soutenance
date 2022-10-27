import { useContext } from "react";
import PostsRefreshContext from "../context/PostsRefreshProvider";

const usePostsRefresh = () => {
	return useContext(PostsRefreshContext);
};

export default usePostsRefresh;
