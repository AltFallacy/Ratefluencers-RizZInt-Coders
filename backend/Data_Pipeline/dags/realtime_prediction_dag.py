from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.empty import EmptyOperator
from airflow.utils.dates import days_ago
from datetime import timedelta

# Direct import of your real-time processing functions from data_pipeline.py
from data_pipeline import (
    process_realtime_influencer_features,
    process_realtime_brand_match_features
)

default_args = {
    "owner": "data_engineering_team",
    "retries": 0, # Fail fast during instant real-time prediction attempts
}

with DAG(
    dag_id="ratefluencer_realtime_inference_etl",
    default_args=default_args,
    description="Transforms single incoming raw prediction inputs into clean ML-ready numeric arrays",
    schedule_interval=None, # Triggered strictly on-demand when prediction runs
    start_date=days_ago(1),
    catchup=False,
    tags=["realtime", "inference", "transformation"],
) as dag:

    start = EmptyOperator(task_id="start_realtime_transform")
    
    task_transform_inf = PythonOperator(
        task_id="engineer_influencer_prediction_arrays",
        python_callable=process_realtime_influencer_features
    )
    
    task_transform_brand = PythonOperator(
        task_id="encode_brand_match_prediction_arrays",
        python_callable=process_realtime_brand_match_features
    )
    
    end = EmptyOperator(task_id="finish_realtime_transform")

    # Run both array transformations in parallel to keep inference snappy
    start >> [task_transform_inf, task_transform_brand] >> end