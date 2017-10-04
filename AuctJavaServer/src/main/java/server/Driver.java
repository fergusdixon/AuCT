package server;

import models.SessionModel;
import java.util.ArrayList;

public class Driver {
    public static void main(String[] args) {
        FileProcessor splitter = new FileProcessor();
        ArrayList<SessionModel> sessions;
        DbHelper db = new DbHelper();
        sessions = db.newSessions();
        for (SessionModel sesh : sessions){
            System.out.println("<<< Processing: " + sesh.getName() + " >>>");
            if(!splitter.processFile(sesh.getName())){
                System.out.println("Please ensure 'name' value is valid, with no extension");
                break;
            }
            db.markSpliced(sesh.getId());
            db.recordSegments(sesh);
            splitter.deleteSegments();

        }
        System.out.println("Complete! Please use Ctrl+C to quit the process.");
    }
}
