#!/bin/sh


#  build_id is inherited from vRCS
DOWNLOAD_PATH=/tmp/deployment/${build_id}

echo "wget "$zipFile" --no-check-certificate --directory-prefix="$DOWNLOAD_PATH

wget $zipFile --no-check-certificate --directory-prefix=$DOWNLOAD_PATH

BASEDIR=$(dirname $0)
echo $BASEDIR

echo "=====clean up from last deployment======-"
rm -rf $HTTP_DOC/*

echo "=====install new artifact======"
cd $DOWNLOAD_PATH
unzip -o $DOWNLOAD_PATH/commerceApp_${build_id}.zip

mv www/* ${HTTP_DOC}

chmod -R 755 ${HTTP_DOC}/*

#echo "====restarting apache====="
#/etc/init.d/httpd restart
