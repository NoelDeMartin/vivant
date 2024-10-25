#!/usr/bin/env bash

# abort on errors
set -e

# build
rm -rf packages/core/dist
rm -rf packages/vivant/dist
rm -rf playground/dist
npm run build

# navigate into the build output directory
cd playground/dist

# prepare github pages
touch .nojekyll

# publish
git init
git checkout -b main
git add -A
git commit -m 'deploy'
git push -f "git@github.com:NoelDeMartin/vivant.git" main:gh-pages

cd -
