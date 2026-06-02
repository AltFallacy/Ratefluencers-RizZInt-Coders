import pandas as pd
import joblib

def predict_growth(input_data):
    """
    Predicts the future percentage growth of an influencer.
    input_data: DataFrame or dict containing the 24 required numerical columns.
    Returns: List of predicted growth rates (floats).
    """
    if isinstance(input_data, dict):
        input_data = pd.DataFrame([input_data])
        
    model = joblib.load('models/growth_prediction_model.pkl')
    encoders = joblib.load('models/growth_prediction_encoders.pkl')
    
    for col, le in encoders.items():
        if col in input_data.columns:
            input_data[col] = input_data[col].astype(str).map(
                dict(zip(le.classes_, le.transform(le.classes_)))
            ).fillna(-1)
            
    expected_features = model.feature_names_in_
    X = input_data[expected_features]
    
    predictions = model.predict(X)
    return predictions.tolist()
