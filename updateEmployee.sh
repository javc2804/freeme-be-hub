#!/bin/bash
#Script de actualizacion automatica de employee Backend
echo $PWD
cd /bq360/employer-backend/
echo $PWD
git pull
pm2 restart 4
echo "Se hizo pull y se reinicio pm2"
pm2 log 4