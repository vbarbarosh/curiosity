FROM node:20.11.0

# https://github.com/Yelp/dumb-init
# ADD --chmod=755 https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 /usr/bin/dumb-init
# Neither GCloud Build nor Bitbucket Pipelines likes `ADD --chmod=755`
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 /usr/bin/dumb-init
RUN chmod 755 /usr/bin/dumb-init

USER node
WORKDIR /app

# Leverage Docker's cache system.
# package.json will be changed less often than other files, so copy it first
# and install all dependencies.
COPY --chown=node:node package*.json /app
RUN npm install

COPY --chown=node:node . /app

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]
