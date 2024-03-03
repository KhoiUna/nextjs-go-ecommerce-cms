#!/bin/bash
git commit -a
git push
git checkout main
git merge dev
git push
git checkout dev