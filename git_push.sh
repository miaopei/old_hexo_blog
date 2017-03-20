#########################################################################
# File Name: git_push.sh
# Author: Maxwell
# mail: miaopei163@163.com
# Created Time: 日  3/19 20:49:08 2017
#########################################################################
#!/bin/sh

hexo clean
hexo generate
hexo deploy

exit 0
