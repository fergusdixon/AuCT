package server;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import com.google.firebase.database.*;
import models.SessionModel;

import java.io.FileInputStream;
import java.util.ArrayList;

import static java.lang.Thread.sleep;

public class Driver {
    public static void main(String[] args) {
        login();
        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference();
        ref.child("sessions").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                runSegmentation();
                System.out.println("Complete! Please use Ctrl+C to quit the process, or leave me running to listen for more changes");
            }

            @Override
            public void onCancelled(DatabaseError error) {

            }
        });

        System.out.println("Listening to DB...");
        do{
            System.out.println("Listening...");
            try {
                sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println();
        }while (true);

    }

    private synchronized static void runSegmentation(){
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
    }

    private static void login() {
        try {
            System.out.println("Logging in...");
            FileInputStream serviceAccount = new FileInputStream("/home/fergus/AuCT/AuctJavaServer/auct-capstone-firebase-adminsdk-57nym-694062f77b.json");

            // Initialize the app with a service account, granting admin privileges
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredential(FirebaseCredentials.fromCertificate(serviceAccount))
                    .setDatabaseUrl("https://auct-capstone.firebaseio.com/")
                    .setStorageBucket("auct-capstone.appspot.com")
                    .build();
            FirebaseApp.initializeApp(options);

            System.out.println("Success");

        }
        catch (Exception e){
            System.out.println("Firebase error: " + e);
        }
    }
}
