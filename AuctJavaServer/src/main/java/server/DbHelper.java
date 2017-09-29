package server;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import com.google.firebase.cloud.StorageClient;
import com.google.firebase.database.*;
import models.SessionModel;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

public class DbHelper {

    public DbHelper(){
        login();
    }

    protected synchronized ArrayList<String> newSessions(String sessionName){
        final FirebaseDatabase database = FirebaseDatabase.getInstance();

        final ArrayList models= new ArrayList<SessionModel>();

        System.out.println("Getting DB reference");
        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference();
        System.out.println("Success, adding event listener...");
        ref.child("sessions").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                Iterable<DataSnapshot> children = snapshot.getChildren();

                for (DataSnapshot child : children){
                    SessionModel model = child.getValue(SessionModel.class);
                    //Wordlis-ref needs to be changed to allow for data model
                    models.add(model);
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {

            }
        });
        System.out.println("Success");

        while (true){
            System.out.println(models.size());
            try {
                wait(200);
            } catch (InterruptedException e) {
                System.out.println("Interrupted");
            }
        }

        //return null;

    }


    private void login() {
        try {
            System.out.println("Logging in...");
            FileInputStream serviceAccount = new FileInputStream("/home/fergus/AuCT/AuctJavaServer/auct-capstone-firebase-adminsdk-57nym-694062f77b.json");

            // Initialize the app with a service account, granting admin privileges
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredential(FirebaseCredentials.fromCertificate(serviceAccount))
                    .setDatabaseUrl("https://auct-capstone.firebaseio.com/")
                    .build();
            FirebaseApp.initializeApp(options);

            System.out.println("Success");

        }
        catch (Exception e){
            System.out.println("Firebase error: " + e);
        }
    }
}
