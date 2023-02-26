FROM node:18-alpine as builder
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

COPY . /app

ARG NEXT_PUBLIC_API_ROOT

RUN yarn run build

RUN yarn install --prod && yarn cache clean

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app /app

CMD ["yarn", "run", "start"]
