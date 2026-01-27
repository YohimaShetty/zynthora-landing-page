# Zynthora.ai Landing Page - Docker Deployment

Professional landing page for Zynthora.ai with Docker containerization for easy deployment.

## 📦 Project Structure

```
zynthora-landing/
├── Dockerfile              # Docker build instructions
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf              # Nginx server configuration
├── .dockerignore          # Files to exclude from Docker build
├── index.html             # Main HTML file
├── style.css              # Stylesheet
├── script.js              # JavaScript functionality
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (comes with Docker Desktop)

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the container:**
   ```bash
   docker-compose up -d
   ```

2. **Access the website:**
   Open your browser and navigate to: `http://localhost:8080`

3. **Stop the container:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker CLI

1. **Build the Docker image:**
   ```bash
   docker build -t zynthora-landing:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 8080:80 --name zynthora-web zynthora-landing:latest
   ```

3. **Access the website:**
   Open your browser and navigate to: `http://localhost:8080`

4. **Stop and remove the container:**
   ```bash
   docker stop zynthora-web
   docker rm zynthora-web
   ```

## 🔧 Configuration

### Change Port
To run on a different port (e.g., 3000), modify `docker-compose.yml`:
```yaml
ports:
  - "3000:80"
```

Or with Docker CLI:
```bash
docker run -d -p 3000:80 --name zynthora-web zynthora-landing:latest
```

### Custom Domain
Update the `server_name` in `nginx.conf`:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

## 🛠️ Useful Commands

### View running containers
```bash
docker ps
```

### View container logs
```bash
docker logs zynthora-landing
```

### Access container shell
```bash
docker exec -it zynthora-landing sh
```

### Rebuild after changes
```bash
docker-compose up -d --build
```

### Remove all (including volumes)
```bash
docker-compose down -v
```

## 🌐 Production Deployment

### With SSL/HTTPS (Using Let's Encrypt)

1. Install Certbot
2. Modify nginx.conf to include SSL certificates
3. Update docker-compose.yml to mount certificate volumes

Example additional configuration:
```yaml
volumes:
  - ./certbot/conf:/etc/letsencrypt
  - ./certbot/www:/var/www/certbot
ports:
  - "80:80"
  - "443:443"
```

### Environment Variables

You can add environment-specific configurations:

```bash
# Create .env file
NGINX_PORT=80
DOMAIN=zynthora.ai
```

## 📊 Performance

The Docker image includes:
- ✅ Nginx Alpine (lightweight ~5MB base)
- ✅ Gzip compression enabled
- ✅ Static asset caching (1 year)
- ✅ Security headers configured
- ✅ Optimized for production

## 🐛 Troubleshooting

### Port already in use
```bash
# Find what's using the port
lsof -i :8080

# Use a different port
docker run -d -p 8081:80 --name zynthora-web zynthora-landing:latest
```

### Container won't start
```bash
# Check logs
docker logs zynthora-landing

# Remove and rebuild
docker-compose down
docker-compose up -d --build
```

### Permission issues
```bash
# Run with sudo (Linux)
sudo docker-compose up -d
```

## 📝 Development

To modify the website:

1. Edit `index.html`, `style.css`, or `script.js`
2. Rebuild the container:
   ```bash
   docker-compose up -d --build
   ```
3. Refresh your browser

## 🚢 Deploy to Cloud

### AWS ECS
```bash
# Tag image
docker tag zynthora-landing:latest your-ecr-repo/zynthora-landing:latest

# Push to ECR
docker push your-ecr-repo/zynthora-landing:latest
```

### Google Cloud Run
```bash
# Build and submit
gcloud builds submit --tag gcr.io/your-project/zynthora-landing

# Deploy
gcloud run deploy zynthora-landing --image gcr.io/your-project/zynthora-landing --platform managed
```

### DigitalOcean App Platform
Use the Dockerfile directly or push to a registry and deploy via the UI.

### Heroku
```bash
# Login to Heroku Container Registry
heroku container:login

# Build and push
heroku container:push web -a your-app-name

# Release
heroku container:release web -a your-app-name
```

## 📄 License

© 2025 Zynthora.ai. All rights reserved.

## 🤝 Support

For issues or questions:
- Email: contact@zynthora.ai
- Create an issue in the repository

---

**Built with ❤️ for Zynthora.ai**
