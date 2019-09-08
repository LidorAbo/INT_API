FROM node:latest
ARG app_folder=/usr/src/app
ARG regular_user=1000
EXPOSE 3000/tcp
WORKDIR ${app_folder}
USER root
RUN chown -R ${regular_user}:${regular_user} ${app_folder}
USER node
COPY ./sources ./
RUN npm install
CMD ["npm", "start"]
