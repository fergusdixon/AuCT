# @Author   Fergus Strangways-Dixon
# @Date     7/09/2017
# This is the module that handles segmentation of audio files

import ffmpeg
import sys

def segment(inputFile, outputDirectory):
    sys.stdout = open('test.txt', 'w')
    stream = ffmpeg.input(inputFile)
    stream = stream.
    stream = ffmpeg.filter_(stream, 'silencedetect', noise='-30dB', d='0.5')
    stream = ffmpeg.output(stream, 'test.wav')
    ffmpeg.run(stream)
    print("Hey")


segment("sample_fruit_quiet.wav", "test.wav")
