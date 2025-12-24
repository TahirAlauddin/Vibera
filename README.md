# Vibera 💜

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

The API will be available at `http://localhost:8000`

## Contributing

Please read [contribution.md](contribution.md) for our contribution guidelines and code of conduct.

