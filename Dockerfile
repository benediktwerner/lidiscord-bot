FROM node:16

WORKDIR /enbotsant

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./
RUN yarn build

CMD ["yarn", "start"]
