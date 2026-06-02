from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.empty import EmptyOperator
from airflow.utils.dates import days_ago
from datetime import timedelta

# Direct import through container system environment paths
# Notice we completely dropped load_to_qdrant from the imports!
from data_pipeline import (
    extract_raw_data,
    validate_data,
    engineer_features,
    load_to_neondb
)

default_args = {
    "owner": "data_engineering_team",
    "retries": 1,
    "retry_delay": timedelta(minutes=2),
}

with DAG(
    dag_id="ratefluencer_clean_etl",
    default_args=default_args,
    description="Production-grade pure data engineering pipeline layout",
    schedule_interval=None, # Set to None for manual execution run triggers during the demo
    start_date=days_ago(1),
    catchup=False,
    tags=["engineering", "etl", "core"],
) as dag:

    start = EmptyOperator(task_id="pipeline_start")
    
    task_extract  = PythonOperator(task_id="extract_raw_data", python_callable=extract_raw_data)
    task_validate = PythonOperator(task_id="validate_data", python_callable=validate_data)
    task_features = PythonOperator(task_id="engineer_features", python_callable=engineer_features)
    
    task_load_neon   = PythonOperator(task_id="load_to_neondb", python_callable=load_to_neondb)
    
    end = EmptyOperator(task_id="pipeline_end")

    # ── CLEAN RELATIONAL FLOW DEPENDENCY GRAPH ─────────────────
    #
    #   start ──► extract ──► validate ──► engineer ──► load_to_neondb ──► end
    #
    # ───────────────────────────────────────────────────────────
    
    start >> task_extract >> task_validate >> task_features >> task_load_neon >> end