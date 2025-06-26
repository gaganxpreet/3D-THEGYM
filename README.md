# 3D THEGYM - A Comprehensive Fitness Partner

A full-stack application for fitness tracking, nutrition management, and workout planning. This project combines calorie counting, workout AI, fitness assessment, and more to provide a complete fitness solution.

## Features

- **Calorie Counter**: Search for foods using the USDA Food Database API, track meals by date, and monitor nutrition goals
- **Workout AI**: Get personalized workout recommendations based on your fitness level and goals
- **Fitness Assessment**: Evaluate your current fitness level with comprehensive tests
- **Personal Training**: Access personalized training plans and track your progress
- **Classes**: Browse and join fitness classes with detailed schedules
- **Membership**: Manage your membership details and subscription
- **User Authentication**: Secure login and profile management
- **Responsive Design**: Optimized for both desktop and mobile devices

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion for animations
- Three.js for 3D elements
- GSAP for advanced animations

## Deployment

### GitHub Setup

1. Create a new repository on GitHub
2. Initialize the local repository and push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/gymsphere.git
git push -u origin main
```

3. Set up GitHub Secrets for CI/CD:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `USDA_API_KEY`: Your USDA API key
     - `YOUTUBE_API_KEY`: Your YouTube API key
     - `GEMINI_API_KEY`: Your Gemini API key

The repository includes a GitHub Actions workflow that will automatically build and test your application on push or pull request to the main branch.

### Vercel Deployment

1. Sign up or log in to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect the Next.js configuration
4. Configure the following environment variables in the Vercel dashboard:
   - `USDA_API_KEY`: For food database access
   - `YOUTUBE_API_KEY`: For video content
   - `GEMINI_API_KEY`: For AI-powered features
5. Deploy with a single click

## Development

### Environment Setup

1. Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

2. Update the `.env.local` file with your API keys:
   - Get a USDA API key from [USDA FoodData Central](https://fdc.nal.usda.gov/api-key-signup.html)
   - Get a YouTube API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Backend API Documentation

### Authentication Endpoints

#### Register a new user
```
POST /api/auth/register
```
Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```
POST /api/auth/login
```
Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Logout
```
POST /api/auth/logout
```

### User Profile Endpoints

#### Get user profile
```
GET /api/user/profile
```

#### Update user profile
```
PUT /api/user/profile
```
Request body:
```json
{
  "name": "Updated Name"
}
```

### Meal Endpoints

#### Get all meals
```
GET /api/meals
```

#### Get meals by date
```
GET /api/meals?date=2023-05-01
```

#### Add a new meal
```
POST /api/meals
```
Request body:
```json
{
  "name": "Breakfast",
  "date": "2023-05-01",
  "mealType": "breakfast",
  "foods": [
    {
      "id": "123456",
      "name": "Eggs",
      "servingSize": 100,
      "calories": 155,
      "protein": 13,
      "carbs": 1.1,
      "fat": 11
    }
  ]
}
```

#### Get a specific meal
```
GET /api/meals/{id}
```

#### Update a meal
```
PUT /api/meals/{id}
```
Request body:
```json
{
  "foods": [
    {
      "id": "123456",
      "name": "Eggs",
      "servingSize": 150,
      "calories": 232.5,
      "protein": 19.5,
      "carbs": 1.65,
      "fat": 16.5
    }
  ]
}
```

#### Delete a meal
```
DELETE /api/meals/{id}
```

### Nutrition Endpoints

#### Get nutrition goals and macro ratios
```
GET /api/nutrition
```

#### Get only nutrition goals
```
GET /api/nutrition?type=goals
```

#### Get only macro ratios
```
GET /api/nutrition?type=macros
```

#### Update nutrition goals
```
PUT /api/nutrition
```
Request body:
```json
{
  "type": "goals",
  "data": {
    "calories": 2000,
    "protein": 150,
    "carbs": 200,
    "fat": 67
  }
}
```

#### Update macro ratios
```
PUT /api/nutrition
```
Request body:
```json
{
  "type": "macros",
  "data": {
    "protein": 30,
    "carbs": 40,
    "fat": 30
  }
}
```

### USDA Food Database Endpoints

#### Search for foods
```
POST /api/usda-search
```
Request body:
```json
{
  "query": "apple"
}
```

#### Get food details
```
POST /api/usda-details
```
Request body:
```json
{
  "fdcId": "123456"
}
```

## Implementation Notes

- The backend uses a file-based storage system as a temporary solution before implementing a real database.
- API responses are cached to improve performance and reduce API calls.
- Authentication is implemented using HTTP-only cookies for security.
- The middleware protects routes that require authentication.

## Future Improvements

- Implement a real database (MongoDB, PostgreSQL, etc.)
- Add social login options (Google, Facebook, etc.)
- Implement meal planning and recipe features
- Add data visualization for nutrition trends
- Implement barcode scanning for food items
