# @Author   Fergus Strangways-Dixon
# @Date     7/09/2017
# This is the module that handles segmentation of audio files

import os
import subprocess
import sys
from pathlib import Path


def segment(inputfile):
    try:
        my_file = Path("../input/" + inputfile)
        if my_file.is_file():
            subprocess.call(["./process.sh", inputfile])
            print("File " + inputfile + " was split, results stored in AuctServer/output")
        else:
            print("There was an error, please ensure the file name was defined correctly and is in AuctServer/input.")
    except:
        print("There was an error, please ensure the file name was defined correctly and is in AuctServer/input.")
