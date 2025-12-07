# Use official Node.js image from ECR Public to avoid Docker Hub rate limits
FROM public.ecr.aws/docker/library/node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source
COPY . .

# Expose port
EXPOSE 6600

# Start server
CMD ["node", "src/index.js"]
