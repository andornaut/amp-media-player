ARG NODE_VERSION=24.21.0
FROM koalaman/shellcheck:v0.11.0 AS shellcheck
FROM node:${NODE_VERSION}

COPY --from=shellcheck /bin/shellcheck /usr/local/bin/shellcheck

WORKDIR /opt/check
COPY package.json package-lock.json ./
RUN git config --system url.https://github.com/.insteadOf ssh://git@github.com/ && \
    git config --system --add url.https://github.com/.insteadOf git@github.com: && \
    HUSKY=0 npm ci --maxsockets=1 --legacy-peer-deps --no-audit --no-fund
ENV PATH="/opt/check/node_modules/.bin:${PATH}"
COPY tests/container/check /opt/check/run
RUN chmod 755 /opt/check/run
USER 19001:19001
