# Cheetah Test Project

## Overview

This project is a responsive web application for conducting surveys for Nike shoes. It features a modern, visually appealing interface with a gradient background, decorative elements, and a form for users to enter their email and start the survey.

## Features

- Responsive design for both mobile and desktop views
- Animated shoe image with hover effect
- Email validation
- Loading state for form submission
- Accessibility features
- Temporary storing of forms for accessing form progress via email anywhere
- Final storing of forms

## Technologies Used

- React
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Supabase Database
- Mongo DB

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/Cheetah-Test-App.git
   ```

2. Navigate to the project directory:
   ```
   cd test-app
   ```

3. Install dependencies:
   ```
   yarn install
   ```

4. Start the development server:
   ```
   yarn dev
   ```

5. Open your browser and visit `http://localhost:3000`

## Project Structure

- `pages/`: Contains the main page components
- `api`: for making API for storing data on Mongo DB
- `types`: for consistent data type components across app
- `lib`: /supabase for supabase functions
- `components/`: Reusable React/ShadCN components
- `public/`: Static assets like images
- `styles/`: Global styles and Tailwind CSS configuration

## Deployment

This project can be easily deployed on Vercel:

1. Push your code to a GitHub repository.
2. Sign up for a Vercel account and connect it to your GitHub account.
3. Import the project from GitHub.
4. Vercel will automatically detect the Next.js project and set up the build configuration.
5. Click "Deploy" and your application will be live in minutes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
