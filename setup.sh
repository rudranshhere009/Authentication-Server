#!/bin/bash

echo "---- Grid Auth Server Full Setup ----"

# 1. Update package lists
echo "Updating package lists..."
sudo apt update

# 2. Install Python 3, pip, venv
echo "Installing Python 3, pip, and venv..."
sudo apt install -y python3 python3-pip python3-venv

# 3. Install Node.js and npm
echo "Installing Node.js and npm..."
sudo apt install -y nodejs npm

# 4. Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# 5. Remove old venv if it exists (not portable across OSes)
if [ -d "venv" ]; then
    echo "Removing old virtual environment (not portable across OSes)..."
    rm -rf venv
fi

# 6. Create Python virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# 7. Activate virtual environment and install Python dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 8. Install Node.js dependencies for admin dashboard
if [ -d "admin-dashboard" ]; then
    echo "Installing Node.js dependencies for admin dashboard..."
    cd admin-dashboard
    npm install
    cd ..
else
    echo "No admin-dashboard directory found. Skipping frontend setup."
fi

# 9. Reminders for manual steps
echo ""
echo "---------------------------------------------"
echo "IMPORTANT MANUAL STEPS:"
echo "1. Set up your .env file in grid-auth-server directory."
echo "   Example:"
echo "   DATABASE_URL=postgresql+asyncpg://postgres:<yourpassword>@localhost/grid_auth"
echo "   SECRET_KEY=your_super_secret_key"
echo ""
echo "2. Create your PostgreSQL database and user if not already done:"
echo "   sudo -u postgres psql"
echo "   # In psql shell:"
echo "   CREATE DATABASE grid_auth;"
echo "   ALTER USER postgres PASSWORD '<yourpassword>';"
echo "   \\q"
echo ""
echo "3. Initialize the database tables:"
echo "   source venv/bin/activate"
echo "   python init_db.py"
echo ""
echo "4. Start the FastAPI server:"
echo "   uvicorn main:app --host 0.0.0.0 --port 8000"
echo ""
echo "5. (Optional) Start the admin dashboard:"
echo "   cd admin-dashboard"
echo "   npm start"
echo "---------------------------------------------"
echo "Setup complete!"