FROM astrocrpublic.azurecr.io/runtime:3.2-4
FROM quay.io/astronomer/astro-runtime:11.3.0

# Create application directory structures
RUN mkdir -p /usr/local/airflow/include/data/raw \
    && mkdir -p /usr/local/airflow/include/data/staging \
    && mkdir -p /usr/local/airflow/include/models

# Copy pipeline modules to path source target
COPY pipeline_setup/ /usr/local/airflow/pipeline_setup/
ENV PYTHONPATH="/usr/local/airflow/pipeline_setup:${PYTHONPATH}"

# Install explicit pipeline dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt