# ── Stage 1: Dependency cache ──────────────────────────────────────────────────
FROM maven:3.9.9-eclipse-temurin-21-alpine AS deps
WORKDIR /build
COPY pom.xml .
# Download all dependencies without source (cached layer — rebuilt only when pom.xml changes)
RUN mvn dependency:go-offline -B -q

# ── Stage 2: Build & package ───────────────────────────────────────────────────
FROM deps AS builder
COPY src ./src
RUN mvn package -DskipTests -B -q

# ── Stage 3: Extract layered JAR ───────────────────────────────────────────────
# Spring Boot 3.3+ layered-jar extraction (faster startup, better layer caching)
FROM eclipse-temurin:21-jre-alpine AS extractor
WORKDIR /build
COPY --from=builder /build/target/*.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract \
      --layers --launcher --destination extracted

# ── Stage 4: Minimal runtime image ────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy extracted layers (ordered: least → most likely to change → smallest rebuild)
COPY --from=extractor /build/extracted/dependencies/          ./
COPY --from=extractor /build/extracted/spring-boot-loader/    ./
COPY --from=extractor /build/extracted/snapshot-dependencies/ ./
COPY --from=extractor /build/extracted/application/           ./

USER appuser

EXPOSE 8080

# Actuator health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"status":"UP"' || exit 1

# JVM container-aware flags:
#  -UseContainerSupport     → respect cgroup memory/CPU limits
#  -MaxRAMPercentage        → use 75% of container RAM for heap
#  -ExitOnOutOfMemoryError  → crash-fast instead of limping
#  -XX:+TieredCompilation with -XX:TieredStopAtLevel=1 removed (let JIT run fully in prod)
ENV JAVA_TOOL_OPTIONS="\
  -XX:+UseContainerSupport \
  -XX:MaxRAMPercentage=75.0 \
  -XX:+ExitOnOutOfMemoryError \
  -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
