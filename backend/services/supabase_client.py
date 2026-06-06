from supabase import create_client
from dotenv import load_dotenv
import os
from typing import Dict, Any

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase environment variables")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


def safe_insert(table_name: str, data: Dict[str, Any]) -> Any:
    """
    Safely insert data into a Supabase table by filtering out columns that don't exist.
    
    Args:
        table_name: Name of the table to insert into
        data: Dictionary of data to insert
        
    Returns:
        Supabase response object
    """
    try:
        # Query one row to get existing column names
        response = supabase.table(table_name).select("*").limit(1).execute()
        
        if response.data:
            existing_columns = set(response.data[0].keys())
        else:
            # If table is empty, try to get columns from the table schema
            # This is a fallback - we'll just insert as-is and let Supabase handle errors
            print(f"[safe_insert] Table {table_name} is empty, inserting without filtering")
            return supabase.table(table_name).insert(data).execute()
        
        # Filter data to only include existing columns
        filtered_data = {
            k: v
            for k, v in data.items()
            if k in existing_columns
        }
        
        # Log ignored fields
        ignored_fields = set(data.keys()) - existing_columns
        if ignored_fields:
            print(f"[safe_insert] Ignored columns for table {table_name}:")
            for field in ignored_fields:
                print(f"  - {field}")
        
        # Insert filtered data
        return supabase.table(table_name).insert(filtered_data).execute()
        
    except Exception as e:
        print(f"[safe_insert] Error inserting into {table_name}: {e}")
        # Fallback: try to insert without filtering
        return supabase.table(table_name).insert(data).execute()


def safe_update(table_name: str, data: Dict[str, Any], match_column: str = "id", match_value: Any = None) -> Any:
    """
    Safely update data in a Supabase table by filtering out columns that don't exist.
    
    Args:
        table_name: Name of the table to update
        data: Dictionary of data to update
        match_column: Column name to match for the update (default: "id")
        match_value: Value to match for the update (if None, uses data[match_column])
        
    Returns:
        Supabase response object
    """
    try:
        # Query one row to get existing column names
        response = supabase.table(table_name).select("*").limit(1).execute()
        
        if response.data:
            existing_columns = set(response.data[0].keys())
        else:
            # If table is empty, try to get columns from the table schema
            print(f"[safe_update] Table {table_name} is empty, updating without filtering")
            if match_value is None:
                match_value = data.get(match_column)
            return supabase.table(table_name).update(data).eq(match_column, match_value).execute()
        
        # Filter data to only include existing columns
        filtered_data = {
            k: v
            for k, v in data.items()
            if k in existing_columns
        }
        
        # Log ignored fields
        ignored_fields = set(data.keys()) - existing_columns
        if ignored_fields:
            print(f"[safe_update] Ignored columns for table {table_name}:")
            for field in ignored_fields:
                print(f"  - {field}")
        
        # Update filtered data
        if match_value is None:
            match_value = data.get(match_column)
        return supabase.table(table_name).update(filtered_data).eq(match_column, match_value).execute()
        
    except Exception as e:
        print(f"[safe_update] Error updating {table_name}: {e}")
        # Fallback: try to update without filtering
        if match_value is None:
            match_value = data.get(match_column)
        return supabase.table(table_name).update(data).eq(match_column, match_value).execute()
