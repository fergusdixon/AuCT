#!/bin/bash
# script to split audio
LIST=$(ffmpeg -i "sample_fruit_quiet.wav" -af silencedetect=noise=-30dB:d=0.5 -f s16le /dev/null -y 2>&1 | grep silencedetect | cut -d ' ' -f4-5)
# $word monitors whether we are in non-silent section
word="false"
start=-1
end=-1

split(){
    if [ $(echo " $start > 0" | bc) -eq 1 ]
    then
        echo "split ${start} ${end}"
    fi
}

for LINE in ${LIST}
do
if [ "${LINE}" = "silence_end:" ]
then
    word="true"
elif [ "${LINE}" = "silence_start:" ]
then
    word="false"
elif [ "${word}" = "true" ]
then
    start="${LINE}"
else
    end="${LINE}"
    split
fi
done



#if silence ends, next line is beginning of word
#if silence starts, next line is end of word, split