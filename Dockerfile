FROM apify/actor-node:20

# Copy package files
COPY --chown=myuser:myuser package*.json ./

# Install NPM packages
RUN npm --quiet set progress=false \
    && npm install --omit=dev --omit=optional

# Copy source code
COPY --chown=myuser:myuser . ./

# Run the image
CMD npm start --silent
