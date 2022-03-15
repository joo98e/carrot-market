/**
 * @argument {darkmode}
 * darkMode : media | class
 * media : 브라우저 설정
 * class : 웹 브라우저만의 설정
 * media가 기본 값 / 권고하는 것은 media(자동)
 */

module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
  darkmode : "class"
}
