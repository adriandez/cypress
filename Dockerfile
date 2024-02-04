# Start from the Node.js base image
FROM node:20.11.0

# Set the working directory in the Docker image
WORKDIR /app

# Install Xvfb, D-Bus, and other necessary dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb \
    dbus-x11 \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb && \
    dbus-uuidgen > /var/lib/dbus/machine-id && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g npm@latest && \
    # Verify that npm and node are correctly installed
    node --version && npm --version

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install project dependencies, including Cypress
RUN npm ci

# Set up the Xvfb display
ENV DISPLAY=:99

# Add environment variable for D-Bus
ENV DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus

# Create a custom entrypoint script to start necessary services
RUN echo $'#!/bin/bash\n\
# Start D-Bus\n\
dbus-daemon --session --fork\n\
# Start Xvfb\n\
Xvfb :99 -screen 0 1280x720x24 > /dev/null 2>&1 &\n\
# Wait a bit for Xvfb to start\n\
sleep 3\n\
exec "$@"' > /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Copy the rest of your project files into the Docker image
COPY . .

# However, if you prefer to keep it here for build-time verification, it's included:
RUN npx cypress verify

# The CMD instruction should be used to run Cypress
# This is the default command that runs when the container starts
CMD ["npx", "cypress", "run", "--headless", "--browser", "electron"]
