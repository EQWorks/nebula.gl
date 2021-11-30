#!/bin/bash
yarn build
find . -name dist -not -path "**node_modules/*" \
| xargs -i sh -c  '\
    cd {}/..;\
    rm -f dist.tgz;\
    pwd;\
    yarn build;\
    tar --exclude='dist.tgz' --exclude='bundle.js' --exclude='node_modules' -czf dist.tgz .'
