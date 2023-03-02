module.exports = {
    content: ["./src/**/*.tsx", "./src/styles/classes.ts"],
    theme: {
        extend: {
            boxShadow:  {
                "3xl": '0 35px 60px -15px rgba(0, 0, 0, 0.3)'
            },
            colors: {
                txt: {
                    logo: "#EFEFEF",
                    subtitle: "#8A8A8A",
                    warn:  "#FF9C54",
                    check: "#CFD0D3",
                    settings: "#CCDAE7"
                },
                container: {
                    100: "#ffffff0d",
                    reveal: "#797980",
                },
                component: {
                    input: {
                        bg:  "#151515",
                        border: "#2F2F2F",
                        placeholder:  "#555555"
                    },
                    btn: {
                        100: "#00ffa314",
                        200: "#00FFA3",
                        300: "#272727",
                        400: "#797979",
                        500: "#FCFCFC",
                        600: "#F9FAFA",
                        700: "#1E2229", 
                    },
                    menuicon: {
                        100: "#5F5F5F",
                        200: "#00FFA3"
                    }
                },
                border:  {
                    100: "#ffffff26",
                    200: "#676767",
                    300: "#323232"
                },
                primary: {
                    100: "#E7F1FB",
                    200: "#D9E9FA",
                    300: "#00FFA3",
                },
                header: {
                    100: "#272727",
                    200: "#1A1A1C",
                    step: {
                        100: "#333333",
                        200: "#00FFA3"
                    }
                },

                body:  {
                    100: "#212121",
                    200: "#212121",
                    300: "#272727",
                    400: "#424242",
                    500: "#8F8E8E",
                    600: "#C9C9C9",
                    700: "#848484",
                    800:  "#2A2A2A",
                    900: "#8A929A",
                    balances: {
                        100: "#00ffa314",
                        200: "#00ffa3",
                        300: "#00ffa355",
                    },
                    assets: {
                        100: "#2A2A2A",
                        200:  "#C9C9C9"
                    },
                    activity: {
                        100: "#c9c9c9fc",
                        200: "#e9e9e999",
                        300: "#363636"
                    },
                    networkSelect: {
                        100: "#312F2F"
                    },
                    collectibles: {
                        100: "#1414145c"
                    }
                },
                footer: {
                    100: "#2A2A2A"
                },
                gray: {
                    900: "#0A121E",
                },
            },
            borderRadius: {
                sm: "4px",
            },
            keyframes: {
                "privacy-rotate": {
                    "0%": { transform: "rotateX(0deg)" },
                    "100%": { transform: "rotateX(360deg)" },
                },
                "spinner-dash": {
                    "0%": {
                        "stroke-dasharray": "1, 150",
                        "stroke-dashoffset": "0",
                    },
                    "50%": {
                        "stroke-dasharray": "90, 150",
                        "stroke-dashoffset": "-35",
                    },
                    "100%": {
                        "stroke-dasharray": "90, 150",
                        "stroke-dashoffset": "-124",
                    },
                },
                "spinner-rotate": {
                    "100%": { transform: "rotate(360deg)" },
                },
            },
            animation: {
                "privacy-rotate": "privacy-rotate 0.5s ease-in-out",
                "spinner-dash": "spinner-dash 1.5s ease-in-out infinite",
                "spinner-rotate": "spinner-rotate 2s linear infinite",
            },
            transitionProperty: {
                width: "width",
            },
            fontSize: {
                xxs: ".625rem",
            },
            fill: ({ theme }) => ({
                gray: "#8093AB",
                danger: "red",
                black: theme("colors.black"),
                selected: theme("colors.primary.300"),
            }),
            stroke: () => ({
                gray: "#8093AB",
                black: "#0A121E",
            }),
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        // ...
    ],
}
