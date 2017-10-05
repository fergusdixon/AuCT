# AuctJavaServer
## processing node for the Audio Capture Project

### Requirements
- ffmpeg
- gradle

### Usage
In the AuctJavaServer root directory:
- `./gradlew build`
- `./gradlew run`

This will build, then execute a pull froom Firebase for unprocessed sessions.
If any are found, they are downloaded, split, and reuploaded automatically.
There is comprehensive logging throughout the process, so keep an eye on it.

If you suspect a Firebase error, it has a log file: `simplelogger.log`

Once complete the processing is complete, it must be exited manually, 
as Firebase doesn't play nicely with ending threads on request.
It will prompt you to exit with `Ctrl+C` once complete.

On exit, the process will delete all local audio files downloaded from cloud storage.
