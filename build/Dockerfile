# Base image
FROM node:20.16.0 AS base

# Set the working directory
WORKDIR /app

# Install bash, debugging tools, and headless dependencies
RUN apt-get update && apt-get install -y bash procps && \
    chmod 1777 /tmp /var/tmp /dev/shm && \
    mkdir -p /usr/local/bin && \
    chmod 755 /usr/local/bin

# Copy and install headless dependencies
COPY build/install-headless-dependencies.sh /usr/local/bin/install-headless-dependencies.sh
RUN chmod +x /usr/local/bin/install-headless-dependencies.sh && \
    /bin/bash /usr/local/bin/install-headless-dependencies.sh

# Copy package.json and package-lock.json and install project dependencies
COPY package*.json ./
RUN npm install -g npm@latest && npm ci

# Set environment variables
ENV DISPLAY=:99 \
    TERM=xterm \
    XDG_RUNTIME_DIR=/tmp

# Copy custom scripts and make them executable
COPY build/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY build/verify-cypress.sh /usr/local/bin/verify-cypress.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh /usr/local/bin/verify-cypress.sh

# Set docker-entrypoint.sh as the entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Copy the rest of the project files
COPY . .

# Specific stages for Chrome, Firefox, and Edge
FROM browser-install as chrome
ARG INSTALL_BROWSER=chrome
ENV INSTALL_BROWSER=${INSTALL_BROWSER}

# Install the selected browser
COPY build/install-browser.sh /usr/local/bin/install-browser.sh
RUN chmod +x /usr/local/bin/install-browser.sh && /usr/local/bin/install-browser.sh

# Default commant to run when starting the container
CMD ["npm","run","test"]

FROM browser-install as firefox
ARG INSTALL_BROWSER=firefox
ENV INSTALL_BROWSER=${INSTALL_BROWSER}

# Install the selected browser
COPY build/install-browser.sh /usr/local/bin/install-browser.sh
RUN chmod +x /usr/local/bin/install-browser.sh && /usr/local/bin/install-browser.sh

# Default commant to run when starting the container
CMD ["npm","run","test"]

FROM browser-install as edge
ARG INSTALL_BROWSER=edge
ENV INSTALL_BROWSER=${INSTALL_BROWSER}

# Install the selected browser
COPY build/install-browser.sh /usr/local/bin/install-browser.sh
RUN chmod +x /usr/local/bin/install-browser.sh && /usr/local/bin/install-browser.sh

# Default commant to run when starting the container
CMD ["npm","run","test"]
