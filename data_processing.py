import pandas as pd
import logging
import os

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def process_data(input_file, output_dir):
    logging.info(f"Loading data from {input_file}...")
    try:
        # Load the data, assuming it has columns: user_id, item_id, category_id, behavior_type, timestamp
        df = pd.read_csv(input_file)
        
        logging.info("Preprocessing data...")
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='s')
        df['date'] = df['timestamp'].dt.date
        df['hour'] = df['timestamp'].dt.hour
        
        os.makedirs(output_dir, exist_ok=True)
        
        # Summary statistics
        logging.info("Calculating summary statistics...")
        summary = pd.DataFrame({
            'user_count': [df['user_id'].nunique()],
            'item_count': [df['item_id'].nunique()],
            'category_count': [df['category_id'].nunique()],
            'click_count': [len(df[df['behavior_type'] == 'pv'])],
            'purchase_count': [len(df[df['behavior_type'] == 'buy'])],
            'cart_count': [len(df[df['behavior_type'] == 'cart'])],
            'fav_count': [len(df[df['behavior_type'] == 'fav'])]
        })
        summary.to_csv(os.path.join(output_dir, 'summary_data.csv'), index=False)
        
        # Daily behavior
        logging.info("Calculating daily behavior metrics...")
        daily = df.groupby(['date', 'behavior_type']).size().unstack(fill_value=0).reset_index()
        daily = daily.rename(columns={'pv': 'click', 'buy': 'purchase'})
        daily.to_csv(os.path.join(output_dir, 'daily_behavior.csv'), index=False)
        
        # Hourly behavior
        logging.info("Calculating hourly behavior metrics...")
        hourly = df.groupby(['hour', 'behavior_type']).size().unstack(fill_value=0).reset_index()
        hourly = hourly.rename(columns={'pv': 'click', 'buy': 'purchase'})
        hourly.to_csv(os.path.join(output_dir, 'hourly_behavior.csv'), index=False)
        
        # Top Items
        logging.info("Extracting top items...")
        top_clicks = df[df['behavior_type'] == 'pv'].groupby('item_id').size().reset_index(name='count')
        top_clicks = top_clicks.sort_values(by='count', ascending=False).head(10)
        top_clicks.to_csv(os.path.join(output_dir, 'top_click_items.csv'), index=False)
        
        top_purchases = df[df['behavior_type'] == 'buy'].groupby('item_id').size().reset_index(name='count')
        top_purchases = top_purchases.sort_values(by='count', ascending=False).head(10)
        top_purchases.to_csv(os.path.join(output_dir, 'top_purchase_items.csv'), index=False)
        
        logging.info("Data processing completed successfully.")
        
    except Exception as e:
        logging.error(f"Error during data processing: {e}")

if __name__ == '__main__':
    # This is a sample run expecting UserBehavior.csv to be present
    process_data('UserBehavior.csv', 'data')
