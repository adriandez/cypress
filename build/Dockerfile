# Start from the Node.js base image
FROM node:20.11.0

# Set the working directory in the Docker image
WORKDIR /app

# Install necessary dependencies for running browsers headlessly
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
    wget \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils && \
    dbus-uuidgen > /var/lib/dbus/machine-id && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Declare TEST_BROWSER as an argument
ARG TEST_BROWSER

# Install Google Chrome or Firefox based on TEST_BROWSER
RUN if [ "$TEST_BROWSER" = "chrome" ]; then \
        wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /usr/share/keyrings/google-chrome-archive-keyring.gpg && \
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome-archive-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
        apt-get update && apt-get install -y google-chrome-stable; \
    elif [ "$TEST_BROWSER" = "firefox" ]; then \
        apt-get update && apt-get install -y --fix-missing firefox-esr; \
    fi && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Update npm to the latest version
RUN npm install -g npm@latest

# Install project dependencies, including Cypress
RUN npm ci

# Set environment variables
ENV DISPLAY=:99
ENV DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
ENV TERM=xterm

# Copy custom scripts and make them executable
COPY build/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY build/verify-cypress.sh /usr/local/bin/verify-cypress.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh /usr/local/bin/verify-cypress.sh

# Set docker-entrypoint.sh as the entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Copy the rest of your project files into the Docker image
COPY . .

# Default command to run when starting the container
CMD ["npx", "cypress", "run", "--headless"]
