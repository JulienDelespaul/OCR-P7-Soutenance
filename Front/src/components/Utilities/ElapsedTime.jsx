// display elapsed time since the post was created
const ElapsedTime = (date) => {
	const now = new Date();
	const postDate = new Date(date);
	const diff = now - postDate;
	const diffInMinutes = Math.floor(diff / 1000 / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	const diffInMonths = Math.floor(diffInDays / 30);
	const diffInYears = Math.floor(diffInMonths / 12);
	if (diffInMinutes < 2) {
		return `${diffInMinutes} minute`;
	} else if (diffInMinutes < 60) {
		return `${diffInMinutes} minutes`;
	} else if (diffInHours === 1) {
		return `${diffInHours} heure`;
	} else if (diffInHours < 24) {
		return `${diffInHours} heures`;
	} else if (diffInDays === 1) {
		return `${diffInDays} jour`;
	} else if (diffInDays < 30) {
		return `${diffInDays} jours`;
	} else if (diffInMonths < 12) {
		return `${diffInMonths} mois`;
	} else if (diffInYears === 1) {
		return `${diffInYears} an`;
	} else {
		return `${diffInYears} ans`;
	}
};

export default ElapsedTime;
