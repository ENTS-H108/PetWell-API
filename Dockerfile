FROM node:20

# Set the working directory
WORKDIR /PetWell-API

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Python, pip, and venv
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create a virtual environment
RUN python3 -m venv /opt/venv

# Ensure the virtual environment is used for subsequent RUN commands
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip inside the virtual environment
RUN pip install --upgrade pip

# Install TensorFlow and OpenCV for Python inside the virtual environment
RUN pip install tensorflow opencv-python-headless

# Copy the rest of the application code
COPY . .

# Set environment variable for port
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
