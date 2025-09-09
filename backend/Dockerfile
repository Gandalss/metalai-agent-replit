FROM python:3.12-slim

# System dependencies für OpenCV
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libgl1 \
    libgomp1 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Environment für headless Betrieb
ENV DISPLAY=""
ENV QT_QPA_PLATFORM="offscreen"

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Test ob OpenCV funktioniert
RUN python -c "import cv2; print('OpenCV funktioniert!')"

COPY . .

EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "--timeout", "120", "run:app"]
