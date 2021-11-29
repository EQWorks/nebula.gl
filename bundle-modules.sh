#!/bin/bash
find . -name dist.tgz | xargs rm -f
find . -name dist | xargs -I '{}' tar --exclude='./test' -C {}/.. -czvf {}/../dist.tgz .
