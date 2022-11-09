#!/bin/bash
echo "Sprint de  backup de bases de datos mongo"
NOW=$(date +"%d-%m-%Y")
echo $NOW
cd  /tmp	
echo $PWD
mongodump --uri="mongodb://localhost:27017"
NAMEF="BD_Backup_${NOW}"
echo $NAMEF
tar -cvzf $NAMEF.tgz dump/
echo "debe generar una compresion de la carpeta dump"
ls
dropbox_uploader upload $NAMEF.tgz  /"10-3 Backup externo 360 y mas"/$NAMEF.tgz
echo "se borrara carpeta dump"
rm -r dump/
ls
echo "backup terminado"
