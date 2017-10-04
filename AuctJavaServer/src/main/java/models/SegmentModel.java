package models;

public class SegmentModel {
    String filename, label;
    int scrapped, session, verified;

    public SegmentModel(){}

    public SegmentModel(String filename, String label, int scrapped, int session, int verified) {
        this.filename = filename;
        this.label = label;
        this.scrapped = scrapped;
        this.session = session;
        this.verified = verified;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public int getScrapped() {
        return scrapped;
    }

    public void setScrapped(int scrapped) {
        this.scrapped = scrapped;
    }

    public int getSession() {
        return session;
    }

    public void setSession(int session) {
        this.session = session;
    }

    public int getVerified() {
        return verified;
    }

    public void setVerified(int verified) {
        this.verified = verified;
    }
}
