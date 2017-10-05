# AuCT
(Audio Capture Tool)

South Africa has eleven official languages. Building out tools to support small-scale voice recognition across a large number of languages requires having a large amount of labeled audio files for training and testing. Your task is to create a web-based, or combination web- and mobile-based tool to support the collection and in situ segmentation and labeling of audio data. The use case is: a participant would use your tool to record a set of words from a list. These would then be segmented, with some control to throw out mistakes that may have been made during data capture, resulting in a set of individual, labeled audio files.

## Core features
- [x] Input/select the word list that user will read aloud
- [x] Record audio while user reads the list
- [x] Fragment audio per word
- [x] Editor to sample audio files and label which word they correspond to
- [x] Some way to save the fragmented audio files (database, zip download, etc)
- [x] Audio playback
- [x] UNICODE text support

## Optional features
- “Whatever you want”
- Can be Algorithmic or User-based splicing (or a combination)
  - [x] ALGO : Record big chunks and process
  - [ ] USER : Capture button presses for words and mistakes WHILST recording audio
- [ ] Adjust playback speed, scrubbing, skipping
- [ ] Optional downloading at lower audio quality (bitrate change)
- [ ] Customise UI for other languages
- [x] Choose language when first visiting site (on landing page)
- [ ] Support different unit sizes (words, phrases, sentences)
- [x] Trim silent ends of words to remove all silence from a clip

## Usage

### Backend
Gradle handles the build, so make sure you have Gradle installed
`sudo apt-get install gradle`

The wrapper is preconfigured, so to build & run from the AuctJavaServer root dir:
- `./gradlew build`
- `./gradlew run`

This will:
- Check the Firebase DB for any files not yet marked as spliced
- Download each file, split it per word, and upload back to the Cloud Storage bucket under "Output"
- After each file has been uploaded, it adds a record of each segment in the DB/segments directory under the original file's name
- The backend keeps no local files after termination
