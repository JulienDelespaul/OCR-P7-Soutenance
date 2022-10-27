/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#FD2d01",
				secondary: "#ffd7d7",
				tertiary: "#4e5166",
			},
			height: {
				112: "28rem",
				128: "32rem",
			},
		},
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({
				".no-scrollbar::-webkit-scrollbar": {
					display: "none",
				},

				".no-scrollbar": {
					"-ms-overflow-style": "none",
					"scrollbar-width": "none",
				},
			});
		}),
	],
};
