import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def load_data():
    #dataset
    d=pd.read_csv("C:\\Users\\Rajeev\\Downloads\\Crop_recommendation.csv")
    return d

def train_model(d):
    X=d[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y=d['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model=RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred=model.predict(X_test)
    print(f"Model Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    return model

def get_user_input():
    N=float(input("Enter Nitrogen level (N):"))
    P=float(input("Enter Phosphorus level (P):"))
    K=float(input("Enter Potassium level (K):"))
    temperature=float(input("Enter Temperature (°C):"))
    humidity=float(input("Enter Humidity (%):"))
    ph=float(input("Enter Soil pH:"))
    rainfall=float(input("Enter Rainfall (mm):"))
    feature_names=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    user_input_df=pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]], columns=feature_names)
    
    return user_input_df

##def get_user_input():
##    N = float(input("Enter Nitrogen level (N): "))
##    P = float(input("Enter Phosphorus level (P): "))
##    K = float(input("Enter Potassium level (K): "))
##    temperature = float(input("Enter Temperature (°C): "))
##    humidity = float(input("Enter Humidity (%): "))
##    ph = float(input("Enter Soil pH: "))
##    rainfall = float(input("Enter Rainfall (mm): "))
##    return np.array([[N, P, K, temperature, humidity, ph, rainfall]])

def main():
    df=load_data()
    model=train_model(df)
    user_data=get_user_input()
    prediction=model.predict(user_data)
    print(f"Recommended Crop: {prediction[0]}")

if __name__ == "__main__":
    main()
