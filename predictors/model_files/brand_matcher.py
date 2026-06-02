import pandas as pd
import joblib

def predict_brand_match(input_data):
    """
    Predicts the compatibility score between a brand and an influencer.
    input_data: DataFrame or dict containing the 18 required brand and influencer columns.
    Returns: List of match scores (0 to 10).
    """
    if isinstance(input_data, dict):
        input_data = pd.DataFrame([input_data])
        
    model = joblib.load('models/brand_match_model.pkl')
    encoders = joblib.load('models/brand_match_encoders.pkl')
    
    for col, le in encoders.items():
        if col in input_data.columns:
            input_data[col] = input_data[col].astype(str).map(
                dict(zip(le.classes_, le.transform(le.classes_)))
            ).fillna(-1)
            
    expected_features = model.feature_names_in_
    X = input_data[expected_features]
    
    predictions = model.predict(X)
    return predictions.tolist()
