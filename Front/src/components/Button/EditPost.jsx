import "../Button/button.css";

//button to open the edit profile modal
const EditPost = ({ setShowModal }) => {
	return (
		<button onClick={setShowModal} className="brutal-btn">
			Modifier
		</button>
	);
};

export default EditPost;
