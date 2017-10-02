package server;

import models.SessionModel;

import java.util.ArrayList;

public class Driver {
    public static void main(String[] args) {
        FileProcessor splitter = new FileProcessor();
//        splitter.processFile("auct_list02_20170928123423.wav");
        ArrayList<SessionModel> sessions = new ArrayList<>();
        DbHelper db = new DbHelper();
        sessions = db.newSessions();
        for (SessionModel sesh : sessions){
            System.out.println("<<< Processing: " + sesh.getName() + " >>>");
            splitter.processFile(sesh.getName());
            System.out.println("Split!");
        }
        System.out.println("Complete!");
    }
}
