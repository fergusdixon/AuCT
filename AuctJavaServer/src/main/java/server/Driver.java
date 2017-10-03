package server;

import com.google.firebase.cloud.StorageClient;
import models.SessionModel;

import java.util.ArrayList;

import static com.google.firebase.database.DatabaseReference.goOffline;

public class Driver {
    public static void main(String[] args) {
        FileProcessor splitter = new FileProcessor();
        ArrayList<SessionModel> sessions;
        DbHelper db = new DbHelper();
        sessions = db.newSessions();
        for (SessionModel sesh : sessions){
            System.out.println("<<< Processing: " + sesh.getName() + " >>>");
            splitter.processFile(sesh.getName());
            System.out.println("Split!");
            db.markSpliced(sesh.getId());
            db.recordSegments(sesh);
            splitter.deleteSegments();

        }
        System.out.println("Complete! Please use Ctrl+C to quit the process.");
        goOffline();
    }
}
