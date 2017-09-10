# @Author   Fergus Strangways-Dixon
# @Date     7/09/2017
# This is the main server for handling AuCT request
from Server import Segmentor


def main():
    inp = input("*** DEMO ***\n\n"
                "Please ensure your file is in the 'AuctServer/input' directory\n"
                "Enter the file name, including extension: ")
    print("* Processing " + inp + " *")
    Segmentor.segment(inp)


if __name__ == '__main__':
    main()