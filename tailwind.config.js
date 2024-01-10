module.exports = {
  content: ["./src/**/*.{svelte,html}", "./src/components/**/*.{svelte,html}"],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
        light: {
          ...require("daisyui/src/theming/themes")["corporate"],
          primary: "#ed5338",
          secondary: "#ffbc81",
        },
      },
			{
				business: {
					...require("daisyui/src/theming/themes")["business"],
					primary: "#ba412b",
					secondary: "#3d2b1c",
				}
			}
		],
		darkTheme: "business",
	}
};
