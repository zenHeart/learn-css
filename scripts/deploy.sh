#!/bin/bash
# 修改此目录为共享插座对应家目录
bookRootPath=$(
    cd $(dirname $0)/../docs
    pwd
)
rep_url=$(git remote get-url origin) # 仓库地址

cd ${bookRootPath}
gitbook build

cd _book
git init
git add -A
git commit -m 'deploy'
git push -f ${rep_url} master:gh-pages
