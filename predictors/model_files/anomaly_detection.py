import pandas as pd
import joblib

def predict_anomaly(input_data):
    """
    Predicts if an influencer is an anomaly/bot.
    input_data: DataFrame or dict containing the 34 required numerical columns.
    Returns: List/Array where 1 is normal, -1 is anomalous.
    """
    # Convert dict to DataFrame if necessary
    if isinstance(input_data, dict):
        input_data = pd.DataFrame([input_data])
        
    # Load model and encoders
    model = joblib.load('models/anomaly_detection_model.pkl')
    encoders = joblib.load('models/anomaly_detection_encoders.pkl')
    
    # Encode categorical columns if there are any
    for col, le in encoders.items():
        if col in input_data.columns:
            input_data[col] = input_data[col].astype(str).map(
                dict(zip(le.classes_, le.transform(le.classes_)))
            ).fillna(-1)
            
    # Ensure columns are in the exact same order as training
    expected_features = model.feature_names_in_
    X = input_data[expected_features]
    
    # Predict and return
    predictions = model.predict(X)
    return predictions.tolist()
