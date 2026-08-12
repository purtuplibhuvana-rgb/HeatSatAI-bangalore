import sys, os
# Add project root (Urban Heat Insight/) to PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.api.main import app
from mangum import Mangum

# Export the handler for Vercel serverless function
handler = Mangum(app)
