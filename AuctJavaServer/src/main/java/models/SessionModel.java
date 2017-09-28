package models;

public class SessionModel {

    String date, filepath, language, name;
    int scrapped, spliced, verified, wordlistRef;

    public SessionModel(String date, String filepath, String language, String name, int scrapped, int spliced, int verified, int wordlistRef) {
        this.date = date;
        this.filepath = filepath;
        this.language = language;
        this.name = name;
        this.scrapped = scrapped;
        this.spliced = spliced;
        this.verified = verified;
        this.wordlistRef = wordlistRef;
    }
}
