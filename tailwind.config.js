module.exports = {
    content: [
      './public/**/*.html', // HTML files in the public directory
      './src/**/*.{html,js}', // HTML and JS files in the src directory
      './components/**/*.{html,js}', // HTML and JS files in the components directory
      './pages/**/*.{html,js}', // HTML and JS files in the pages directory
    ],
    theme: {
      extend: {
        colors: {
          // Add custom colors here
        },
        spacing: {
          // Add custom spacing values here
        },
        // Add other customizations here
      },
    },
    plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('preline/plugin'),
      // Add Tailwind CSS plugins here
    ],
  };