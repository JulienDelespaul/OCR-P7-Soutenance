import { createContext, useState } from "react";

const PostsRefreshContext = createContext({});

export const PostsRefreshProvider = ({ children }) => {
	const [refresh, setRefresh] = useState(false);
	const [postId, setPostId] = useState("");

	return <PostsRefreshContext.Provider value={{ refresh, setRefresh, postId, setPostId }}>{children}</PostsRefreshContext.Provider>;
};

export default PostsRefreshContext;
