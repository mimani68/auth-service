# 
# *README
# 
# **Resource**
# -----------------------------
#   https://github.com/BretFisher/node-docker-good-defaults
# 
# 
# **Usage** in CLI mode
# -----------------------------
# sudo docker build \
#  --target development \
#  --file Dockerfile \
#  --tag service:v1.0.1 \ 
#  --build-arg WORK_DIR='/usr/src' \
#  --build-arg BUILD_DATE=$(date --utc --rfc-3339=s) \
#  --build-arg VCS_REF=$(git rev-parse --short HEAD) \
#  --build-arg BUILD_VERSION='1.0.0' \
#  # --env list               # OS envirnoment variable \ 
#  # --label ['test']         # images lable \ 
#  # --isolation="default"    # only windows securety \ 
#  --compress               # Compress the build context using gzip \ 
#  --force-rm               # Always remove intermediate containers \ 
#  .
# 
# 
# 

ARG PRIVATE_WORKDIR_PATH=/usr/src


# --------------------------------------------------
FROM node:10.16.0-stretch AS build_development
# --------------------------------------------------
ARG PRIVATE_WORKDIR_PATH
WORKDIR $PRIVATE_WORKDIR_PATH
# 
USER node
# 
# COPY --chown=node:node package.json ./
COPY package.json lib* .npmrc ./
# COPY lib* ./lib
RUN npm run install:dev
# RUN [[ -d libs ]] && npm run install:dev || echo 'without local dependency' 
COPY . $PRIVATE_WORKDIR_PATH




# --------------------------------------------------
FROM node:10.16.0-stretch AS development
# --------------------------------------------------
ARG NPM_CONFIG_LOGLEVEL_ARG="warn"
ENV NPM_CONFIG_LOGLEVEL=${NPM_CONFIG_LOGLEVEL_ARG}
# 
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
# 
ARG WORK_DIR
WORKDIR $WORK_DIR
# 
ARG PORT
ENV PORT $PORT
# 
ARG PRIVATE_WORKDIR_PATH
# 
# 
# only for watch project and development mode
# -----------------------------
# RUN echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
# 
# 
# disable for better watching folder
# -----------------------------
USER node 
# 
# HEALTHCHECK directly
# -----------------------------
HEALTHCHECK --interval=5m --timeout=10s \
    CMD curl -f http://localhost:${PORT}/healthz || exit 1
# 
# HEALTHCHECK with local library
# -----------------------------
# HEALTHCHECK --interval=30s \
#     CMD node healthcheck.js
# 
COPY --from=build_development ${PRIVATE_WORKDIR_PATH} .
# 
EXPOSE $PORT 9229 9230
# 
CMD [ "npm", "run", "start" ]





# 
# --------------------------------------------------
FROM node:10.16.0-stretch AS test
# --------------------------------------------------
# 
ARG WORK_DIR
WORKDIR $WORK_DIR
# 
ARG PRIVATE_WORKDIR_PATH
# 
COPY --from=development ${PRIVATE_WORKDIR_PATH} .
# 
EXPOSE $PORT
# 
CMD [ "npm", "run", "test:unit" ]


