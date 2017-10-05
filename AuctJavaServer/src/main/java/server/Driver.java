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
    private static final ArrayList<Long> currentSegIndex = getSegIndex();
    public static void main(String[] args) {
        boolean running = false;
        login();
        final DataSnapshot wordlists = getWordLists();

        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference();

        ref.child("sessions").addValueEventListener(new ValueEventListener() {
            boolean working = false;
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                if(!working) {
                    working = true;
                    runSegmentation(snapshot, wordlists, currentSegIndex.get(0));
                    System.out.println("Sessions up to date.");
                    working = false;
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {

            }
        });

        System.out.println("Listening to DB...");
        do{
            //System.out.println("Listening...");
            try {
                sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            //System.out.println();
        }while (true);

    }

    private synchronized static void runSegmentation(DataSnapshot snapshot, DataSnapshot wordlist, long startIndex){

        FileProcessor splitter = new FileProcessor();
        ArrayList<SessionModel> sessions;
        DbHelper db = new DbHelper();

        sessions = db.newSessions(snapshot);
        for (SessionModel sesh : sessions){
            System.out.println("<<< Processing: " + sesh.getName() + " >>>");
            if(!splitter.processFile(sesh.getName())){
                System.out.println("Please ensure 'name' value is valid, with no extension");
                break;
            }

            currentSegIndex.set(0, db.recordSegments(sesh, wordlist, currentSegIndex.get(0)));

            splitter.deleteSegments();
        }
        ArrayList<Integer> ids = new ArrayList<>();
        for (SessionModel sesh : sessions){
            ids.add(sesh.getId());
        }
        db.markSpliced(ids);
        System.out.println("segmentation over");
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

    private synchronized static DataSnapshot getWordLists(){
        ArrayList<DataSnapshot> snap = new ArrayList<>();
        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference("wordlists");
        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                snap.add(snapshot);
            }

            @Override
            public void onCancelled(DatabaseError error) {

            }
        });

        System.out.println("Getting wordlists");
        do{
            try {
                sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }while(snap.size() == 0);
        return snap.get(0);
    }

    private synchronized static ArrayList<Long> getSegIndex(){
        ArrayList<Long> indexArr = new ArrayList<>();
        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference("segments");
        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                indexArr.add(snapshot.getChildrenCount());
            }

            @Override
            public void onCancelled(DatabaseError error) {

            }
        });

        //System.out.println("Getting index...");
        do{
            try {
                System.out.println("Getting index...");
                sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }while(indexArr.size() == 0);
        return indexArr;
    }
}
