# Vibera 

A mood tracking and journaling application built with Django REST Framework.

## Tech Stack

- **Backend**: Django 6.0
- **API**: Django REST Framework

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TahirAlauddin/Vibera.git
   cd Vibera
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On macOS/Linux
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Start the server**
   ```bash
   python manage.py runserver
   ```
### Database Setup (PostgreSQL)

docker run -d \
  --name vibera-postgres \
  -e POSTGRES_DB=vibera_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:18


2. **Update `.env`**:
   Configure your database credentials in the `.env` file:
   ```env
   DB_NAME=vibera_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

The API will be available at `http://127.0.0.1:8000/api/test/`

## Contributing

Please read [contribution.md](contribution.md) for our contribution guidelines and code of conduct.

