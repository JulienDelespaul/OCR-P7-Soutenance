import "../Button/button.css";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
	const navigate = useNavigate();
	return (
		<div className="flex flex-row items-center">
			<button onClick={() => navigate(-1)} className="brutal-btn" type="button">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
			</button>
		</div>
	);
};

export default BackButton;
