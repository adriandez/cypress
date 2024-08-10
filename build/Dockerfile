# Base image
FROM node:20.15.1

# Set the working directory
WORKDIR /app

# Copy the headless dependencies installation script
COPY build/install-headless-dependencies.sh /usr/local/bin/install-headless-dependencies.sh

# Add debugging to check if the script is present
RUN ls -al /usr/local/bin/
RUN ls -al /app/

# Make the script executable and run it
RUN chmod +x /usr/local/bin/install-headless-dependencies.sh && /usr/local/bin/install-headless-dependencies.sh

# Install bash and debugging tools
RUN apt-get update && apt-get install -y bash procps

# Set the INSTALL_BROWSER argument and environment variable
ARG INSTALL_BROWSER=chrome
ENV INSTALL_BROWSER=${INSTALL_BROWSER}

# Copy the browser installation script into the Docker image and execute it
COPY build/install-browser.sh /usr/local/bin/install-browser.sh
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

# Copy the test run script and make it executable
COPY build/run-tests.sh /usr/local/bin/run-tests.sh
RUN chmod +x /usr/local/bin/run-tests.sh

# Copy the rest of your project files into the Docker image
COPY . .

# Default command to run when starting the container
CMD ["/usr/local/bin/run-tests.sh"]