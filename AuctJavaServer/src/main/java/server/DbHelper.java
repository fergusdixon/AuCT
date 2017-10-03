package server;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import com.google.firebase.cloud.StorageClient;
import com.google.firebase.database.*;
import models.SegmentModel;
import models.SessionModel;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class DbHelper {
    private long childrenCount = 0;

    public DbHelper(){
        login();
    }

    protected synchronized ArrayList<SessionModel> newSessions(){
        final ArrayList models= new ArrayList<SessionModel>();

        System.out.println("Getting DB reference");
        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference();
        System.out.println("Success, adding event listener...");
        ref.child("sessions").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                Iterable<DataSnapshot> children = snapshot.getChildren();
                models.clear();

                for (DataSnapshot child : children){
                    SessionModel model = child.getValue(SessionModel.class);
                    if(model.getSpliced()==0) {
                        model.setId(Integer.parseInt(child.getKey()));
                        models.add(model);
                    }
                    childrenCount = snapshot.getChildrenCount();
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {

            }
        });
        System.out.println("Success");
        System.out.println("Waiting for response, if this takes too long it may mean there are no new sessions to segment.");

        do{
            System.out.println(".....");
            try {
                wait(2000);
            } catch (InterruptedException e) {
                System.out.println("Interrupted");
            }
        } while (models.size()==0);
        System.out.println(models.size() + " unprocessed sessions found");
        childrenCount = 0;
        return models;

    }

    public void markSpliced(int id){
        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference();
        Map<String, Object> splice = new HashMap<String, Object>();
        splice.put("spliced", 1);

        ref.child("sessions/"+id).updateChildren(splice);
    }

    public void recordSegments(SessionModel session){
        Path directory = Paths.get("/home/fergus/AuCT/AuctJavaServer/src/output/"+session.getName());
        try {
            DatabaseReference ref = FirebaseDatabase
                    .getInstance()
                    .getReference();

            Files.walkFileTree(directory, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    SegmentModel segment = new SegmentModel(
                            "Output/" + session.getName() + "/" +
                            file.toString().substring(file.toString().indexOf("seg")),
                            "",
                            0,
                            session.getId(),
                            0);
                    ref.child("segments").push().setValue(segment);

                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
//                    Files.delete(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private void login() {
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
