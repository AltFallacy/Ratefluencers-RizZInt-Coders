# Ratefluencers - RizZInt Coders

This project is a comprehensive influencer marketing analytics platform, integrating a modern Next.js web application with a robust Python-based Machine Learning backend.

## Project Structure

- **Frontend**: A modern web application built with [Next.js](https://nextjs.org).
- **Predictors (`/predictors`)**: Contains the trained Machine Learning models, label encoders, and Python helper scripts for data analysis.
  - **Models**:
    - Anomaly Detection (Isolation Forest)
    - Growth Prediction (XGBoost Regressor)
    - Brand Matcher (XGBoost)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm / yarn / pnpm
- Python 3.8+ (for running the predictor scripts)

### Frontend Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running the ML Models

To interact with the predictor scripts, navigate to the `predictors` folder. The folder includes scripts that use pre-trained models for matching brands and tracking influence growth:

```bash
cd predictors
# Make sure to install dependencies like pandas, scikit-learn, and xgboost.
python model_files/brand_matcher.py
```
