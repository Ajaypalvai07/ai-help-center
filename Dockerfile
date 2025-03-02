FROM ollama/ollama:latest

# Set environment variables
ENV OLLAMA_ORIGINS=${OLLAMA_ORIGINS}
ENV OLLAMA_HOST=${OLLAMA_HOST}

# Expose the Ollama API port
EXPOSE 11434

# Download the Mistral model during build
RUN ollama pull mistral

# Start Ollama
CMD ["ollama", "serve"]