#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Tiki Data — Mac Bootstrapper
# ══════════════════════════════════════════════════════════════

echo "🚀 Initializing Tiki Data Dashboard..."

# 1. Check for Java
if ! command -v java &> /dev/null; then
    echo "❌ Error: Java is not installed. Please install Java 21 or higher."
    exit 1
fi

# 2. Check for Maven, if not found, use a wrapper or install via brew (if available)
if ! command -v mvn &> /dev/null; then
    echo "📦 Maven not found. Downloading Maven Wrapper..."
    
    # Create wrapper directories
    mkdir -p .mvn/wrapper
    
    # Download wrapper files from official source
    curl -L https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper-distribution/3.3.2/maven-wrapper-distribution-3.3.2-bin.zip -o mw.zip
    unzip -o mw.zip
    mv -f maven-wrapper-distribution-3.3.2/* .
    rm -rf mw.zip maven-wrapper-distribution-3.3.2
    
    MVN_CMD="./mvnw"
else
    MVN_CMD="mvn"
fi

echo "🔨 Building project and starting server..."
$MVN_CMD spring-boot:run -Dspring-boot.run.arguments="--server.port=8082"
