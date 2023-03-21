# FROM node:18-alpine AS test
# RUN addgroup app && adduser -S -G app app
# RUN mkdir /package && chown app:app /package
# USER app
# WORKDIR package
# COPY . .
# RUN npm run lint 
# CMD npm run test

FROM node:18-buster-slim
RUN useradd -ms /bin/bash app
RUN mkdir /package && chown app:app /package
USER app
WORKDIR package
COPY . .
RUN npm i --omit=dev
CMD npm run start