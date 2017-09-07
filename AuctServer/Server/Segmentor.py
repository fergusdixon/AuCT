# @Author   Fergus Strangways-Dixon
# @Date     7/09/2017
# This is the module that handles segmentation of audio files

import ffmpeg
import subprocess

def segment(inputFile, outputDirectory):

    cmd = "ffmpeg -i " + inputFile + " -filter_complex \"[0:a]silencedetect=n=-90dB:d=0.3[outa]\" -map [outa] -f s16le -y " \
          "/dev/null |& F='-aq 70 -v warning' perl -ne 'INIT { $ss=0; $se=0; } if (/silence_start: (\S+)/) { $ss=$1; " \
          "$ctr+=1; printf \"ffmpeg -nostdin -i " + inputFile + " -ss %f -t %f $ENV{F} -y %03d.mkv\\n\", $se, ($ss-$se), " \
          "$ctr; } if (/silence_end: (\S+)/) { $se=$1; } END { printf \"ffmpeg -nostdin -i " + inputFile +  "-ss %f $ENV{F} " \
          "-y %03d.mkv\\n\", $se, $ctr+1; }' | bash -x "
    exec(cmd);
    # ffmpeg.input(inputFile)
    # (ffmpeg
    #     .input(inputFile)
    #     .filter_('silencedetect', 'noise=-30dB', 'd=0.5')
    #     .output('split.m4a')
    #     .run()
    #  )


segment("sample_fruit_quiet.m4a", "outputs/test.m4a")
