module.exports = {
  // Use the plugin factory functions directly. This avoids depending on
  // a separate adapter package and works with the installed Tailwind
  // version in this repo.
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
