# 🏝 Travel Itinerary Application

A comprehensive web application for planning travel itineraries with interactive maps, route optimization, and collaborative sharing features.

## Features

- **Interactive Map Interface**: Create routes by clicking on the map and plan your journey visually
- **Multi-Day Itineraries**: Organize your trips into multiple days with separate routes for each day
- **Automatic Route Planning**: Get optimized routes between locations with distance calculation
- **Drag & Drop Reordering**: Easily reorder locations in your itinerary
- **PDF Export**: Generate detailed PDF documents of your travel plans
- **User Authentication**: Register and login to save your itineraries
- **Public/Private Itineraries**: Choose to keep your plans private or share them with the community

## Technology Stack

### Frontend
- React.js
- React Leaflet for interactive maps
- Axios for API requests
- jsPDF for PDF generation
- @hello-pangea/dnd for drag-and-drop functionality

### Backend
- Node.js with Express.js
- MongoDB with Mongoose for data storage
- JWT for authentication
- bcryptjs for password encryption
- Cookie-based authentication flow

### APIs
- OpenRouteService API for route planning
- Nominatim for geocoding and place search

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm
- MongoDB instance
- OpenRouteService API key

### Environment Setup

1. Clone the repository:
```
git clone https://github.com/belovezhalin/travel-itinerary.git
cd travel-itinerary
```

2. Create `.env` file in the server directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

3. Create `.env` file in the client directory:
```
REACT_APP_ORS_API_KEY=your_openrouteservice_api_key
```

### Server Setup

1. Install server dependencies:
```
cd server
npm install
```

2. Start the server:
```
npm start
```

### Client Setup

1. Install client dependencies:
```
cd client
npm install
```

2. Start the client:
```
npm start
```

The application will be accessible at http://localhost:3000

## Usage

1. **Create an Account or Use Anonymous Mode**
   - Register to save your itineraries or continue without logging in

2. **Create a New Itinerary**
   - Click on the "New Itinerary" button
   - Click on the map to add locations to your route

3. **Manage Your Route**
   - Add custom labels to your locations
   - Drag and drop to reorder locations
   - Add notes to each location
   - Delete unwanted stops

4. **Multi-Day Planning**
   - Add additional days using the "Add Day" button
   - Switch between days to plan each day separately

5. **Save and Export**
   - Save your itinerary to access it later
   - Export your plan as a PDF with distance information

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Itineraries
- `GET /api/itineraries` - Get all public and user's itineraries
- `GET /api/itineraries/:id` - Get specific itinerary
- `POST /api/itineraries` - Create new itinerary
- `PUT /api/itineraries/:id` - Update an itinerary
- `DELETE /api/itineraries/:id` - Delete an itinerary

## License

This project is licensed under the MIT License.
