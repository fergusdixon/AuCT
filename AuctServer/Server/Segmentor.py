# @Author   Fergus Strangways-Dixon
# @Date     7/09/2017
# This is the module that handles segmentation of audio files

import os
import subprocess
import sys

def segment(inputFile, outputDirectory):

    subprocess.call("./process.sh")


segment("sample_fruit_quiet.wav", "test.wav")
