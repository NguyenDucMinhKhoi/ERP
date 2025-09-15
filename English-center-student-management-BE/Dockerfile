# Base image
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/root/.local/bin:$PATH"

WORKDIR /app

# Cài gói cần thiết để build Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev netcat-traditional \
 && rm -rf /var/lib/apt/lists/*

# ===========================
# Stage 1: Install dependencies
# ===========================
FROM base AS builder

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# ===========================
# Stage 2: Final image
# ===========================
FROM base AS final

# Copy dependencies từ builder (install --user => ~/.local/)
COPY --from=builder /root/.local /root/.local

# Copy source code
COPY . .

# Entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Default command (override được trong docker-compose)
CMD ["/entrypoint.sh"]
