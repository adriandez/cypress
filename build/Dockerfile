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
    xvfb \
    # Install wget and fonts to support headless browser testing
    wget \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
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
    rm -rf /var/lib/apt/lists/* && \
    npm install -g npm@latest && \
    # Verify that npm and node are correctly installed
    node --version && npm --version

# Install Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update && apt-get install -y google-chrome-stable && rm -rf /var/lib/apt/lists/*

# Install Firefox
RUN apt-get update && apt-get install -y --fix-missing firefox-esr && rm -rf /var/lib/apt/lists/*


# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install project dependencies, including Cypress
RUN npm ci

# Set up the Xvfb display and add environment variable for D-Bus
ENV DISPLAY=:
ENV DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus

# Set TERM environment variable to avoid terminal-related warnings
ENV TERM xterm

# Copy custom scripts into the Docker image and make them executable
COPY build/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY build/verify-cypress.sh /usr/local/bin/verify-cypress.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh /usr/local/bin/verify-cypress.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Copy the configurations.json file into the Docker image
COPY configurations.json ./configurations.json

# Copy the rest of your project files into the Docker image
COPY . .

# The CMD instruction should be used to run Cypress
# This is the default command that runs when the container starts
CMD ["npx", "cypress", "run", "--headless"]
