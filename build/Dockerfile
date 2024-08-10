# Base image
FROM node:20.16.0

# Set the working directory
WORKDIR /app

# Copy the headless dependencies installation script
COPY build/install-headless-dependencies.sh /usr/local/bin/install-headless-dependencies.sh

# Add debugging to check if the script is present and list environment variables
RUN ls -al /usr/local/bin/ && \
    ls -al /app/ && \
    env && \
    pwd

# Make the script executable and run it
RUN chmod +x /usr/local/bin/install-headless-dependencies.sh && \
    /bin/bash /usr/local/bin/install-headless-dependencies.sh

# Install bash and debugging tools
RUN apt-get update && apt-get install -y bash procps

# Set the INSTALL_BROWSER argument and environment variable
ARG INSTALL_BROWSER=chrome
ENV INSTALL_BROWSER=${INSTALL_BROWSER}

# Copy the browser installation script into the Docker image and execute it
COPY build/install-browser.sh /usr/local/bin/install-browser.sh

# Debugging: List files in /usr/local/bin/
RUN ls -la /usr/local/bin/

RUN chmod +x /usr/local/bin/install-browser.sh && /usr/local/bin/install-browser.sh

# Copy package.json and package-lock.json into the Docker image
COPY package.json package-lock.json ./

# Update npm to the latest version
RUN npm install -g npm@latest

# Install project dependencies, including Cypress
RUN npm ci

# Set environment variables
ENV DISPLAY=:99
ENV TERM=xterm
ENV XDG_RUNTIME_DIR=/tmp

# Set correct permissions for /tmp, /var/tmp, and /dev/shm
RUN chmod 1777 /tmp /var/tmp /dev/shm

# Copy the script
COPY build/run-tests.sh /usr/local/bin/run-tests.sh

# Add a debug step to list files in /usr/local/bin/ before running chmod
RUN ls -l /usr/local/bin/ && chmod +x /usr/local/bin/run-tests.sh

# Add another debug step to verify permissions after chmod
RUN ls -l /usr/local/bin/

# Copy the rest of your project files into the Docker image
COPY . .

# Debugging step to verify that files are copied
RUN ls -la /app/

# Default command to run when starting the container
CMD ["/usr/local/bin/run-tests.sh"]
