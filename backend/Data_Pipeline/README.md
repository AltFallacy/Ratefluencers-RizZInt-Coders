# ⚙️ Ratefluencer AI - Data Engineering & ETL Pipeline

This directory houses the Apache Airflow data pipeline deployment managed via **Astronomer (Astro CLI)**. The pipeline is responsible for extracting raw creator data, engineering influencer engagement features, executing validation checks, updating the cloud database (NeonDB), and preparing numeric features for Machine Learning model inference.

---

## 🚀 Key Pipelines (DAGs)

The orchestration includes two main DAGs defined in the `dags/` folder:

### 1. `ratefluencer_clean_etl` (Batch Processing)
* **Frequency**: Manual / Scheduled
* **Purpose**: Orchestrates the master historical data pipeline.
* **Flow**:
  1. **`extract_raw_data`**: Reads raw creator records from the source CSV and staging folders.
  2. **`validate_data`**: Validates schema inputs, checking numeric metrics bounds (e.g. followers >= 0).
  3. **`engineer_features`**: Generates calculated columns:
     - `engagement_rate` = `((likes + comments) / followers) * 100`
     - `share_rate` = `shares / views`
     - `save_rate` = `saves / views`
     - `view_rate` = `views / followers`
     - `follower_following_ratio` = `followers / following`
  4. **`load_to_neondb`**: Synchronizes computed features into the Neon Postgres cloud cluster.

### 2. `ratefluencer_realtime_inference_etl` (On-Demand Transformation)
* **Frequency**: Triggered on-demand when scoring an influencer
* **Purpose**: Runs preprocessing for interactive predictions.
* **Tasks**:
  - **`engineer_influencer_prediction_arrays`**: Fetches latest profile details from RapidAPI (or fallback mock) and saves engineered numerical vectors for Anomaly Detection and Growth models.
  - **`encode_brand_match_prediction_arrays`**: Combines creator parameters with brand search queries and maps categorical columns (niche, country, gender, tiers) into numerical representations for the Brand Matcher.

---

## 🛠️ Setup & Local Development

### 1. Prerequisites
Ensure you have the following installed:
* **Docker Desktop** (must be active and running)
* **Astro CLI** (Astronomer management client)

Install Astro CLI via:
* **macOS**: `brew install astronomer/tap/astro`
* **Windows (winget)**: `winget install Astronomer.Astro`
* **Windows (Chocolatey)**: `choco install astro`

---

### 2. running Airflow Locally

1. **Start the containers**:
   ```bash
   astro dev start
   ```
   This pulls versioned Astro Runtime Docker images and spins up:
   * **Postgres** (Airflow metadata database)
   * **Webserver** (UI dashboard hosted at `http://localhost:8080`)
   * **Scheduler** (monitoring and executing tasks)
   * **Triggerer** (deferred operator events)
   * **DAG Processor** (interpreting code updates)

2. **Access the Airflow Panel**:
   * **URL**: [http://localhost:8080](http://localhost:8080)
   * **Username**: `admin`
   * **Password**: `admin`

3. **Stop the containers**:
   ```bash
   astro dev stop
   ```

4. **Restart the containers**:
   ```bash
   astro dev restart
   ```

---

## 🗄️ Database & Environment Configurations

### 1. Database Migrations
To sync the required SQL schema tables into NeonDB before triggering Airflow DAGs, execute:
```bash
python pipeline_setup/main.py
```
This runs SQLAlchemy schema initialization and creates the `engineered_features` target table.

### 2. Environment Variables (`.env`)
To let the Airflow container connect to your external databases and APIs, populate the `.env` file inside this directory:
```env
NEON_DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_CW0x6DslvAjV@ep-weathered-water-ap14dwje.us-east-1.aws.neon.tech/neondb
OPENROUTER_API_KEY=your_openrouter_api_key
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=your_rapidapi_host
DATA_PATH=/usr/local/airflow/include/data
```
