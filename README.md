# Credit Card Recommendation System

This is a Credit Card Recommendation System built with **Node.js** and **MySQL**. The system helps users find suitable credit cards based on their preferred category. It connects to a MySQL database to fetch credit card details, including benefits and annual fees, and recommends credit cards based on the selected category.

## Features

- Fetches a list of unique credit card categories.
- Recommends credit cards based on the selected category.
- Displays details like card name, category, benefits, and annual fee.
- API endpoints with rate limiting to prevent abuse.
- Responsive web frontend to interact with the backend.

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - MySQL
  - dotenv (for environment variables)
  - express-rate-limit (for rate limiting)
  - CORS (for cross-origin resource sharing)

- **Frontend:**
  - HTML
  - CSS
  - JavaScript (fetch API)

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (or MariaDB)

### Clone the Repository

```bash
git clone https://github.com/your-username/credit-card-recommendation.git
cd credit-card-recommendation
