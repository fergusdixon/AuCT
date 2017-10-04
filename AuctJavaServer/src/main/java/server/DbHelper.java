package server;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
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

public class DbHelper {

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
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {

            }
        });
        System.out.println("Success");
        System.out.println("Waiting for response, if this takes too long it may mean there are no new sessions to segment.");

        do{
            System.out.println("...");
            try {
                wait(2000);
            } catch (InterruptedException e) {
                System.out.println("Interrupted");
            }
        } while (models.size()==0);
        System.out.println(models.size() + " unprocessed sessions found");
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
        System.out.println("Recording segments in DB...");
        try {

            DatabaseReference ref = FirebaseDatabase
                    .getInstance()
                    .getReference();

            HashMap<String, Object> segs = new HashMap<>();
            Files.walkFileTree(directory, new SimpleFileVisitor<Path>() {
                int listNum = Integer.parseInt(
                        session.getName().substring(
                                session.getName().indexOf("list")+4,
                                session.getName().indexOf("_2"))
                )-1;

                ArrayList<String> list = getLabels(listNum);
                long startingIndex = getSegmentIndex();
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    String label;
                    int segNum = Integer.parseInt(
                            file.toString().substring(
                                    file.toString().indexOf("seg_")+4,
                                    file.toString().indexOf("_a"))
                    )-1;
                    if(segNum>=list.size()-1){
                        label = list.get(list.size()-1);
                    }
                    else {
                        label = list.get(segNum);
                    }
                    SegmentModel segment = new SegmentModel(
                            file.toString().substring(file.toString().indexOf("seg")),
                            label,
                            0,
                            session.getId(),
                            0);
                    segs.put(Long.toString(startingIndex), segment);
                    startingIndex++;
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
//                    Files.delete(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
            ref.child("segments").updateChildren(segs);
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("Segment recorded in DB");
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

    private synchronized long getSegmentIndex(){
        final ArrayList<Long> index = new ArrayList<>();
        index.add(0, Long.parseLong("-1"));
        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference();
        ref.child("segments").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                index.set(0, snapshot.getChildrenCount());
            }

            @Override
            public void onCancelled(DatabaseError error) {

            }
        });

        do{
            System.out.println("...");
            try {
                wait(2000);
            } catch (InterruptedException e) {
                System.out.println("Interrupted");
            }
        } while (index.get(0)==-1);
        return index.get(0);
    }

    private synchronized ArrayList<String> getLabels(int listNm){
        final ArrayList<String> words = new ArrayList<>();
        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference();
        ref.child("wordlists/"+listNm + "/words").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                ArrayList<String> list = (ArrayList)snapshot.getValue();
                words.addAll(list);
            }

            @Override
            public void onCancelled(DatabaseError error) {

            }
        });

        do{
            System.out.println("...");
            try {
                wait(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }while (words.size() == 0);

        return words;

    }
}
