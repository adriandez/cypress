FROM node:20.11.0

WORKDIR /app

# Install necessary dependencies for running browsers headlessly
COPY build/install-headless-dependencies.sh /usr/local/bin/install-headless-dependencies.sh
RUN chmod +x /usr/local/bin/install-headless-dependencies.sh && /usr/local/bin/install-headless-dependencies.sh

ARG INSTALL_BROWSER

# Copy the browser installation script into the Docker image and execute it
COPY build/install-browser.sh /usr/local/bin/install-browser.sh
RUN chmod +x /usr/local/bin/install-browser.sh && /usr/local/bin/install-browser.sh

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
ENV XDG_RUNTIME_DIR=/tmp

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