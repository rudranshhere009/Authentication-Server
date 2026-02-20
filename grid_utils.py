# grid_utils.py
import random
import string
import json
import hmac
import hashlib
import os

GRID_SIZE = 5  # 5x5 grid

def generate_grid():
    grid = {}
    for row in string.ascii_uppercase[:GRID_SIZE]:  # 'A' to 'E'
        for col in range(1, GRID_SIZE + 1):         # 1 to 5
            coord = f"{row}{col}"
            value = f"{random.randint(10, 99)}"     # two-digit number
            grid[coord] = value
    return grid

def sign_grid(grid: dict, secret_key: str):
    grid_json = json.dumps(grid, sort_keys=True)
    signature = hmac.new(secret_key.encode(), grid_json.encode(), hashlib.sha256).hexdigest()
    return signature

def verify_grid(grid: dict, signature: str, secret_key: str):
    expected_sig = sign_grid(grid, secret_key)
    return hmac.compare_digest(expected_sig, signature)