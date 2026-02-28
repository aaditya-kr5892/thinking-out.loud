# Use official lightweight JDK image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy jar file into container
COPY target/ThinkingOutLoud-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8081

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]