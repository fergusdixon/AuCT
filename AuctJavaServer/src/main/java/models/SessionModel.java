package models;

public class SessionModel {

    String date, filepath, language, name;
    int scrapped, spliced, verified, wordlist;

    public SessionModel(){}

    public SessionModel(String date, String filepath, String language, String name, int scrapped, int spliced, int verified, int wordlist) {
        this.date = date;
        this.filepath = filepath;
        this.language = language;
        this.name = name;
        this.scrapped = scrapped;
        this.spliced = spliced;
        this.verified = verified;
        this.wordlist = wordlist;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getFilepath() {
        return filepath;
    }

    public void setFilepath(String filepath) {
        this.filepath = filepath;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getScrapped() {
        return scrapped;
    }

    public void setScrapped(int scrapped) {
        this.scrapped = scrapped;
    }

    public int getSpliced() {
        return spliced;
    }

    public void setSpliced(int spliced) {
        this.spliced = spliced;
    }

    public int getVerified() {
        return verified;
    }

    public void setVerified(int verified) {
        this.verified = verified;
    }

    public int getWordlistRef() {
        return wordlist;
    }

    public void setWordlistRef(int wordlistRef) {
        this.wordlist = wordlistRef;
    }

    @Override
    public String toString() {
        return filepath;
    }


}
