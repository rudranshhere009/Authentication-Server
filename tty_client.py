import os
import requests
import getpass

API_URL = os.getenv("VITE_API_URL") or os.getenv("REACT_APP_API_URL") or "http://localhost:8000"
 # Change to your server's address if remote

def print_grid(grid):
    print("\nYour Grid:")
    header = "   " + "  ".join([str(i) for i in range(1, 6)])
    print(header)
    for row in "ABCDE":
        row_vals = [grid[f"{row}{col}"] for col in range(1, 6)]
        print(f"{row}  " + "  ".join(row_vals))
    print()

def main():
    username = input("Username: ")
    password = getpass.getpass("Password: ")

    # Step 1: Login
    resp = requests.post(f"{API_URL}/login", json={"username": username, "password": password})
    if resp.status_code != 200:
        print("Login failed:", resp.json().get("detail"))
        return

    # Step 2: Get grid challenge
    resp = requests.post(f"{API_URL}/grid-challenge", json={"username": username})
    if resp.status_code != 200:
        print("Failed to get grid challenge:", resp.json().get("detail"))
        return

    data = resp.json()
    grid = data["grid"]
    signature = data["signature"]
    challenge_coords = data["challenge_coords"]

    print_grid(grid)
    print("Enter the values for these coordinates:", ", ".join(challenge_coords))
    answers = {}
    for coord in challenge_coords:
        answers[coord] = input(f"{coord}: ").strip()

    # Step 3: Validate grid answers
    resp = requests.post(f"{API_URL}/grid-validate", json={
        "username": username,
        "signature": signature,
        "answers": answers
    })
    if resp.status_code == 200:
        print("Grid MFA successful! You are authenticated.")
    else:
        print("Grid MFA failed:", resp.json().get("detail"))

if __name__ == "__main__":
    main()
