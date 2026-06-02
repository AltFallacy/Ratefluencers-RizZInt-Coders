# 🌌 Ratefluencer AI - RizZInt Coders

An advanced, AI-powered influencer marketing analytics and matchmaking platform. Ratefluencer AI integrates a modern, highly interactive Next.js 16 web application with a robust FastAPI backend, pre-trained Machine Learning models (XGBoost & Isolation Forest), and an Apache Airflow data pipeline managed via Astro CLI to ingest, process, and score creator accounts dynamically.

---

## 🚀 Key Features

- **🛡️ Creator Authenticity & Bot Detection**: Leverages an unsupervised **Isolation Forest** model to analyze 34 distinct engagement metrics and flag fraudulent/bot activities.
- **📈 Growth Velocity Forecasting**: Predicts future percentage growth rates using a regression-based **XGBoost Regressor** trained on historical performance metrics.
- **🤝 Brand-to-Influencer Matchmaking**: Scores brand campaigns against influencer demographics, budget tiers, niches, and follower ranges (0-10 compatibility rating) using **XGBoost**.
- **📊 Interactive Analytics Dashboard**: Modern Next.js frontend using Tailwind CSS v4, Framer Motion, and Recharts to visualize performance KPIs, risk factors, and predictive growth graphs.
- **⚙️ Automated ETL Pipelines**: Scheduled batch ingestion and real-time inference processing powered by **Apache Airflow** and synchronized with a cloud **Neon PostgreSQL** database.

---

## 📂 Project Architecture

```
Ratefluencers-RizZInt-Coders/
├── backend/
│   ├── FastAPI/              # Python FastAPI Web Server & API Gateway
│   │   ├── models/           # Local PKL files for model endpoints
│   │   ├── modules/          # Core scoring logic and mathematical formulations
│   │   ├── routers/          # API Route controllers (score, brands, growth, etc.)
│   │   ├── schemas/          # Pydantic data validation schemas
│   │   ├── database.py       # Async engine configuration (Neon Postgres)
│   │   ├── ai_client.py      # LLM integration client (OpenRouter)
│   │   └── main.py           # FastAPI entrypoint and CORSMiddleware definitions
│   │
│   └── Data_Pipeline/        # Apache Airflow (Astronomer CLI) Data Ingestion
│       ├── dags/             # Airflow DAGs (Batch ETL & Realtime transformation)
│       ├── include/          # Static input files and staging directory datasets
│       ├── pipeline_setup/   # Schema definitions, DB migrations & pipeline operations
│       ├── Dockerfile        # Custom Astronomer runtime image definition
│       └── requirements.txt  # OS-level packages & Airflow pipeline packages
│
├── frontend/                 # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/              # App Router pages (Score, Matching, Dashboard, etc.)
│   │   ├── components/       # Visual components (shadcn/ui + Framer Motion)
│   │   ├── data/             # Static mockup data & fallback states
│   │   ├── services/         # Axios API clients & endpoint bindings
│   │   ├── store/            # State management store (Zustand)
│   │   └── types/            # TypeScript interface definitions
│   ├── tailwind.config.ts    # Tailwind CSS config
│   └── package.json          # Node.js dependencies (React 19, Next.js 16)
│
└── predictors/               # Standalone ML Models & Scripts
    ├── models/               # Model binaries (Anomaly, Brand Match, Growth)
    ├── model_files/          # Standalone python evaluation scripts
    └── model_inputs.txt      # Reference document mapping required features
```

---

## 🛠️ Detailed Setup Instructions

### 1. Prerequisites

Before setting up the components, make sure you have the following installed:
* **Node.js** (v18.x or higher)
* **Python** (v3.9 or higher, ideally 3.10)
* **Docker Desktop** (Required for the Airflow containers)
* **Astro CLI** (Required to manage the Astronomer local dev environment)

---

### 2. Frontend Setup (Next.js)

The frontend is built on Next.js 16, React 19, and Tailwind CSS v4.

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   * Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 3. Backend Setup (FastAPI)

The backend exposes FastAPI endpoints to predict scores and match campaigns using pre-trained ML models.

1. **Navigate to the FastAPI folder**:
   ```bash
   cd backend/FastAPI
   ```

2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the `backend/FastAPI` directory:
   ```env
   NEON_DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_CW0x6DslvAjV@ep-weathered-water-ap14dwje.us-east-1.aws.neon.tech/neondb
   OPENROUTER_API_KEY=your_openrouter_api_key
   QDRANT_URL=http://localhost:6333
   QDRANT_API_KEY=your_qdrant_api_key
   ```

5. **Start the API Server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   * Access the interactive swagger documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 4. Data Pipeline Setup (Apache Airflow / Astro CLI)

The pipeline manages scheduled batch ETL jobs and prepares features for real-time predictions.

1. **Navigate to the Data Pipeline folder**:
   ```bash
   cd backend/Data_Pipeline
   ```

2. **Initialize and Start Airflow**:
   Make sure Docker Desktop is running, then execute:
   ```bash
   astro dev start
   ```
   This command starts 5 local Docker containers (Webserver, Scheduler, Triggerer, DB, DAG Processor).

3. **Access the Airflow UI**:
   * Open [http://localhost:8080](http://localhost:8080)
   * **Credentials**: Username: `admin`, Password: `admin`

4. **Initialize Database Tables**:
   To set up the required schema tables in NeonDB before running the ETL:
   ```bash
   python pipeline_setup/main.py
   ```

---

### 5. Running the Standalone ML Predictors

If you want to run or test the ML models directly outside of the FastAPI/Airflow environments:

1. **Navigate to the predictors folder**:
   ```bash
   cd predictors
   ```

2. **Ensure python dependencies are installed**:
   ```bash
   pip install pandas scikit-learn xgboost joblib
   ```

3. **Evaluate the models**:
   ```bash
   # Test brand matching prediction
   python model_files/brand_matcher.py
   
   # Test anomaly detection
   python model_files/anomaly_detection.py
   
   # Test growth forecasting
   python model_files/growth_prediction.py
   ```

---

## 🧠 Machine Learning Model Configurations

Detailed feature inputs for the models can be found in [model_inputs.txt](file:///c:/Users/Asus/tempRate/Ratefluencers-RizZInt-Coders/predictors/model_inputs.txt). Below is a summary:

### Model 1: Anomaly Detection (Isolation Forest)
* **Goal**: Flags bot followers and engagement spikes.
* **Input Features**: `engagement_rate`, `comment_quality_ratio`, `share_rate`, `save_rate`, `view_rate`, `follower_following_ratio`, `posting_consistency`, `like_spike_variance`, `growth_velocity`, etc. (34 numerical features total).
* **Output**: `1` for normal, `-1` for anomaly.

### Model 2: Growth Rate Prediction (XGBoost Regressor)
* **Goal**: Projects influencer growth trajectory.
* **Input Features**: `engagement_rate`, `comment_quality_ratio`, `share_rate`, `save_rate`, `view_rate`, `follower_following_ratio`, `posting_consistency`, `like_spike_variance`, etc. (24 features total).
* **Output**: Floating point growth percentage (e.g., `5.5%`).

### Model 3: Brand Sponsorship Matcher (XGBoost Regressor)
* **Goal**: Evaluates compatibility between brands and creators.
* **Brand Input**: `category`, `target_age_min`, `target_age_max`, `target_gender`, `min_followers`, `max_followers`, `budget_tier`, `country_focus`.
* **Influencer Input**: `platform`, `niche`, `followers`, `following`, `total_posts`, `account_age_days`, `is_verified`, `country`, `tier`, `is_bot`.
* **Output**: Match rating score from `0.0` to `10.0`.

---

## 🛠️ Verification & Testing

1. **Backend Health Check**:
   Once the backend is up, verify it is running by hitting:
   ```bash
   curl http://localhost:8000/health
   ```
   **Expected Response**:
   ```json
   {"status": "ok", "project": "Ratefluencer AI"}
   ```

2. **Frontend Connectivity**:
   Ensure `NEXT_PUBLIC_API_URL` points to `http://localhost:8000/api/v1` (or your backend url) and check console logs to verify mock/service transitions.
