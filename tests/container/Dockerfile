ARG NODE_VERSION=24.21.0
FROM node:${NODE_VERSION}

WORKDIR /opt/check
COPY package.json package-lock.json ./
RUN git config --system url.https://github.com/.insteadOf ssh://git@github.com/ && \
    git config --system --add url.https://github.com/.insteadOf git@github.com: && \
    HUSKY=0 npm ci --legacy-peer-deps --no-audit --no-fund && \
    npm install --prefix /opt/check/tools --ignore-scripts --no-audit --no-fund markdownlint-cli2@0.24.0
ENV PATH="/opt/check/tools/node_modules/.bin:/opt/check/node_modules/.bin:${PATH}"
COPY tests/container/check /opt/check/run
RUN chmod 755 /opt/check/run
USER 19001:19001
