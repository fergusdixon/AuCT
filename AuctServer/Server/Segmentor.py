# @Author   Fergus Strangways-Dixon
# @Date     7/09/2017
# This is the module that handles segmentation of audio files

import os
import subprocess
import sys

def segment(inputFile, outputDirectory):

    cmd3 = "ffmpeg -i \"sample_fruit_quiet.wav\" -af silencedetect=noise=-30dB:d=0.5 -f s16le /dev/null -y"

    cmd2= "ffmpeg -i sample_fruit_quiet.wav -filter_complex \"[0:a]silencedetect=n=-90dB:d=0.3[outa]\" -map [outa] -f " \
          "s16le -y /dev/null 2>&1 | F='-aq 70 -v warning "

    # cmd2= "ffmpeg -i sample_fruit_quiet.wav -filter_complex \"[0:a]silencedetect=n=-90dB:d=0.3[outa]\" -map [outa] -f s16le -y " \
    #       "/dev/null 2>&1 | F='-aq 70 -v warning' perl -ne 'INIT { $ss=0; $se=0; } if (/silence_start: (\S+)/) { $ss=$1; " \
    #       "$ctr+=1; printf \"ffmpeg -nostdin -i sample_fruit_quiet.wav -ss %f -t %f $ENV{F} -y %03d.wav\n\", $se, ($ss-$se), " \
    #       "$ctr; } if (/silence_end: (\S+)/) { $se=$1; } END { printf \"ffmpeg -nostdin -i sample_fruit_quiet.wav -ss %f $ENV{F} " \
    #       "-y %03d.wav\n\", $se, $ctr+1; }' | bash -x "

    os.chdir('/home/fergus/AuCT/AuctServer/Server')
    cmd = "ffmpeg -i \"sample_fruit_quiet.wav\" -af silencedetect=noise=-30dB:d=0.5 -f null - 2> vol.txt"
    os.system(cmd3)


segment("sample_fruit_quiet.wav", "test.wav")
