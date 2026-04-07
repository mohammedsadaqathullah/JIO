# Jio Clone - ₹2,900 Offer Landing Page

A professional Jio-inspired landing page built with Next.js, React, and Tailwind CSS. This application collects user location and phone number data for exclusive offers and 5G availability checks.

## Features

### 4-Step Onboarding Flow

1. **Hero Section** - Eye-catching landing page with Jio branding showcasing the ₹2,900 offer
2. **Location Permission** - Mandatory geolocation request with clear privacy messaging about 5G checks and offers
3. **Phone Number Input** - User enters 10-digit Indian phone number for SMS confirmation
4. **Success Confirmation** - Confirmation screen promising SMS with bank transfer details and exclusive offers

### Key Features

- **Geolocation Integration**: Uses browser Geolocation API to collect precise latitude and longitude
- **Data Validation**: Phone number and coordinate validation with user-friendly error messages
- **Responsive Design**: Mobile-first design that works on all devices
- **Jio-Inspired UI**: Blue color scheme (#0074E4) matching Jio's brand identity
- **Database Integration**: Neon PostgreSQL backend for secure data storage
- **Professional UX**: Smooth transitions between steps, loading states, and error handling

## Tech Stack

- **Frontend**: Next.js 14+, React 19, TypeScript
- **Styling**: Tailwind CSS v4, with Jio-inspired color palette
- **Database**: Neon PostgreSQL (serverless)
- **Icons**: Lucide React
- **Fonts**: Geist Sans (modern, clean typography)

## Project Structure

```
/app
├── page.tsx                           # Main landing page with flow logic
├── layout.tsx                         # Root layout with Jio metadata
├── globals.css                        # Tailwind configuration
├── api/
│   └── submit-location/route.ts      # API endpoint for saving data
└── components/
    ├── HeroSection.tsx               # Hero banner with offer details
    ├── LocationPermissionModal.tsx    # Geolocation request modal
    ├── PhoneInputForm.tsx             # Phone number input form
    └── SuccessConfirmation.tsx        # Success confirmation screen
/scripts
└── create-tables.sql                  # Database schema creation
```

## Database Schema

### user_signups Table

```sql
CREATE TABLE user_signups (
  id BIGSERIAL PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone_number VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

The table stores:
- **latitude**: Geographic latitude (-90 to 90)
- **longitude**: Geographic longitude (-180 to 180)
- **phone_number**: 10-digit Indian mobile number
- **created_at**: Timestamp of data submission

## Environment Variables

The application requires the following environment variable:

```
DATABASE_URL=postgresql://...
```

This is automatically provided by Neon integration. No additional setup needed.

## User Flow

1. User lands on hero page with Jio branding
2. User clicks "Claim Now" button
3. Browser prompts for location permission
4. User approves → location data collected (latitude/longitude)
5. User enters 10-digit phone number
6. Data submitted to `/api/submit-location`
7. Success confirmation with promise of SMS and bank transfer details
8. Data stored in Neon PostgreSQL database

## Key Highlights

### Why Location is Mandatory
- Check 5G network availability in user's area
- Calculate network speed metrics
- Personalize 4G/5G offers based on location
- Privacy messaging ensures user trust

### SMS Confirmation Promise
- Users receive SMS with bank transfer details
- Exclusive 4G/5G offers personalized to their location
- Location data ensures relevant offers

### Data Security
- Coordinates validated before storage
- Phone numbers validated (10 digits)
- Parameterized SQL queries prevent injection
- All data encrypted in transit (HTTPS)

## API Documentation

### POST /api/submit-location

Saves user location and phone number to database.

**Request Body:**
```json
{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "phoneNumber": "9876543210"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your data has been saved successfully!",
  "id": 1,
  "timestamp": "2024-04-07T10:30:45Z"
}
```

**Error Response (400/500):**
```json
{
  "error": "Invalid phone number. Please enter 10 digits."
}
```

## Validation Rules

- **Phone Number**: Exactly 10 digits, no special characters
- **Latitude**: Between -90 and 90 degrees
- **Longitude**: Between -180 and 180 degrees

## Installation & Deployment

The project is production-ready and can be deployed to Vercel with one click:

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel automatically detects Neon integration
4. Deploy with auto-configured DATABASE_URL

## Design System

### Colors
- **Primary Blue**: #0074E4 (Jio brand color)
- **White**: Background and cards
- **Gray**: Text and borders
- **Green**: Success states
- **Yellow**: Call-to-action accents

### Typography
- **Font Family**: Geist Sans (modern, clean)
- **Headings**: Bold, large sizes for impact
- **Body**: Regular weight for readability
- **Line Height**: 1.4-1.6 for optimal reading

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support with geolocation
- Safari: Full support
- Mobile browsers: Full support

## Notes

- This is a data collection landing page, not an actual payment processor
- SMS sending is simulated (users see success confirmation)
- Bank transfer details are not actually processed
- Geolocation requires HTTPS in production (automatic on Vercel)
