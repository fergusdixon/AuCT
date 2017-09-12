#!/bin/bash

# $word monitors whether we are in non-silent section
WORD="false"
START=-1
END=-1
declare -i NUMBER=0
FILE=$1
DIREC=${FILE%.*}
$(echo cwd)
# script to split audio
LIST=$(ffmpeg -i "../input/${FILE}" -af silencedetect=noise=-30dB:d=0.5 -f s16le /dev/null -y 2>&1 | grep silencedetect | cut -d ' ' -f4-5)

if [[ ! -d "../output/${DIREC}" ]]; then
  mkdir -p "../output/${DIREC}"
fi

split(){
    if [ $(echo " ${START} > 0" | bc) -eq 1 ]
    then
        $(ffmpeg -i "../input/${FILE}" -ss ${START} -to ${END} -c copy -y ../output/"${DIREC}"/${NUMBER}"${FILE}" -loglevel quiet)
    fi
    NUMBER=$(echo ${NUMBER} + 1)
}

for LINE in ${LIST}
do
if [ "${LINE}" = "silence_end:" ]
then
    WORD="true"
elif [ "${LINE}" = "silence_start:" ]
then
    WORD="false"
elif [ "${WORD}" = "true" ]
then
    START="${LINE}"
else
    END="${LINE}"
    split
fi
done