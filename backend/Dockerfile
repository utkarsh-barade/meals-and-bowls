# Stage 1: Build the application
FROM maven:3.9.7-eclipse-temurin-17 AS build
WORKDIR /app
# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src
# Build the application, skipping tests for faster deployment
RUN mvn clean package -DskipTests

# Stage 2: Create a slim runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built jar from the build stage
COPY --from=build /app/target/meals-bowls-0.0.1-SNAPSHOT.jar app.jar

# Render dynamic port binding (default 8080 if PORT isn't set)
ENV PORT=8080
EXPOSE ${PORT}

# Run the application
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
