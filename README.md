# Cars Dealership - Full-Stack Developer Capstone Project

## Project Overview
This is the IBM Full-Stack Developer Capstone Project. The application is a responsive web platform for **Cars Dealership**, a national car retailer in the U.S. It allows users to browse dealership branches, view dealer reviews, and submit their own reviews.

## Technologies Used
- **Frontend:** React, HTML5, CSS3
- **Backend:** Django, Django REST Framework
- **Microservices:** Flask (Sentiment Analysis), Node.js/Express (Dealers & Reviews)
- **Database:** SQLite (Django), MongoDB (Reviews)
- **Deployment:** Docker, Kubernetes, IBM Cloud Code Engine
- **CI/CD:** GitHub Actions

## Features
- View all dealership branches across the U.S.
- Filter dealers by state
- View and post reviews for specific dealers
- Sentiment analysis on review text (Positive / Negative / Neutral)
- User registration, login, and logout
- Admin panel for managing data
- Fully deployed on IBM Cloud Code Engine

## Project Structure
```
├── server/
│   ├── frontend/          # React + Static HTML frontend
│   ├── djangoapp/         # Django backend app
│   ├── database/          # Node.js microservice for dealers/reviews
│   └── sentimentanalyzer/ # Flask microservice for sentiment analysis
├── .github/workflows/     # GitHub Actions CI/CD
└── README.md
```

## Author
**Dhale Glen Caparros** 
GitHub: [dhale-02](https://github.com/dhale-02)
