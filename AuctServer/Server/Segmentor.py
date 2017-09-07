# @Author   Fergus Strangways-Dixon
# @Date     7/09/2017
# This is the module that handles segmentation of audio files

import ffmpeg
import sys

def segment(inputFile, outputDirectory):
    stream = ffmpeg.input(inputFile)
    stream = ffmpeg.filter_(stream, 'silencedetect', noise='-30dB', d='0.5')
    stream = ffmpeg.output(stream, 'test.wav')
    x = ffmpeg.run(stream)
    print(x)


segment("sample_fruit_quiet.wav", "test.wav")
