from flask import Flask, render_template, jsonify
import pandas as pd
import os

app = Flask(__name__)
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

@app.route('/')
def index():
    summary_df = pd.read_csv(os.path.join(DATA_DIR, 'summary_data.csv'))
    data_summary = summary_df.iloc[0].to_dict()
    return render_template('index.html', data_summary=data_summary)

@app.route('/api/chartData')
def chart_data():
    daily_df = pd.read_csv(os.path.join(DATA_DIR, 'daily_behavior.csv'))
    hourly_df = pd.read_csv(os.path.join(DATA_DIR, 'hourly_behavior.csv'))
    top_click_df = pd.read_csv(os.path.join(DATA_DIR, 'top_click_items.csv'))
    top_purchase_df = pd.read_csv(os.path.join(DATA_DIR, 'top_purchase_items.csv'))
    
    dailyChartData = {
        'xAxisData': daily_df['date'].tolist() if 'date' in daily_df else daily_df.iloc[:,0].tolist(),
        'clickData': daily_df['click'].tolist() if 'click' in daily_df else daily_df.iloc[:,1].tolist(),
        'purchaseData': daily_df['purchase'].tolist() if 'purchase' in daily_df else daily_df.iloc[:,2].tolist(),
        'cartData': daily_df['cart'].tolist() if 'cart' in daily_df else daily_df.iloc[:,3].tolist(),
        'favData': daily_df['fav'].tolist() if 'fav' in daily_df else daily_df.iloc[:,4].tolist()
    }
    
    hourlyChartData = {
        'xAxisData': hourly_df['hour'].tolist() if 'hour' in hourly_df else hourly_df.iloc[:,0].tolist(),
        'clickData': hourly_df['click'].tolist() if 'click' in hourly_df else hourly_df.iloc[:,1].tolist(),
        'purchaseData': hourly_df['purchase'].tolist() if 'purchase' in hourly_df else hourly_df.iloc[:,2].tolist()
    }
    
    clickChartData = {
        'xAxisData': top_click_df['item_id'].astype(str).tolist() if 'item_id' in top_click_df else top_click_df.iloc[:,0].astype(str).tolist(),
        'seriesData': top_click_df['count'].tolist() if 'count' in top_click_df else top_click_df.iloc[:,1].tolist()
    }
    
    purchaseChartData = {
        'xAxisData': top_purchase_df['item_id'].astype(str).tolist() if 'item_id' in top_purchase_df else top_purchase_df.iloc[:,0].astype(str).tolist(),
        'seriesData': top_purchase_df['count'].tolist() if 'count' in top_purchase_df else top_purchase_df.iloc[:,1].tolist()
    }
    
    return jsonify({
        'dailyChartData': dailyChartData,
        'hourlyChartData': hourlyChartData,
        'clickChartData': clickChartData,
        'purchaseChartData': purchaseChartData
    })

if __name__ == '__main__':
    app.run(debug=True)
