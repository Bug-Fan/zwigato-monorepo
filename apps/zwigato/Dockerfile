#########################################################################
# Stage 0
# use a node image to build the app
#########################################################################
FROM node:18 AS devbuilder

# change this for every service:
ENV APP=zwigato

# set for cross-plattform builds
USER root

ENV WORKING_DIR=/app

WORKDIR $WORKING_DIR

#########################################################################
# Stage 0
# use an alpine node image for a smaller production image
#########################################################################
FROM node:18-alpine AS settings

# Defaults to production, docker-compose overrides this to development on build and run.
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV WORKING_DIR=/app

ARG port=5001
EXPOSE ${port}

RUN apk add --no-cache tini curl

# folder created by WORKDIR are owned by root
WORKDIR $WORKING_DIR

#########################################################################
# Stage 1
# installs production dependencies
# running audit fix is not necessary here as this will not be part of final image
#########################################################################
FROM devbuilder AS baseimage

# All new files and directories are created with a UID and GID of 0, unless the optional --chown flag specifies a given username, groupname, or UID/GID combination to request specific ownership of the copied content.
COPY package*.json ./



# this will install all dependencies, across all projects
RUN npm config list \
    && npm install \
    && npm cache clean --force

# this adds nx to the executable path
ENV PATH $WORKING_DIR/node_modules/.bin:$PATH

#########################################################################
# Stage 2
# adds dev-dependencies, sets NODE_ENV to development
# doesn't copy files into container (uses mounted files instead)
#########################################################################
FROM baseimage AS dev

ENV NODE_ENV=development

RUN npm config list \
    && npm install \
    && npm cache clean --force

# this should probably be the node user but has to be tested for cross-platform compatibility

CMD npm run nx serve ${APP}

#########################################################################
# Stage 3
# copies all files as preparation for production build
#########################################################################
FROM dev AS source

# only copy the current app
COPY nx.json tsconfig.base.json .eslintrc.json jest.config.ts jest.preset.js ./
COPY ./apps/${APP}/ ./apps/${APP}/

#########################################################################
# Stage 4
# runs linting and tests on production source
#########################################################################
# FROM source AS test

# ENV NODE_ENV=development
# ENV PATH=$WORKING_DIR/node_modules/.bin:$PATH

# COPY --from=dev $WORKING_DIR/node_modules $WORKING_DIR/node_modules

# RUN npm run nx lint ${APP}

# RUN npm run nx test ${APP}
