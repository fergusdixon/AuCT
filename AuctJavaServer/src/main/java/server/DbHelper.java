package server;

import com.google.firebase.database.*;
import models.SegmentModel;
import models.SessionModel;

import javax.xml.crypto.Data;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class DbHelper {

    public DbHelper(){}

    /**
     * Fetch any sessions in the DB that have not yet been recorded
     * @return ArrayList of SessionModels
     */
    protected synchronized ArrayList<SessionModel> newSessions(DataSnapshot snapshot){
        final ArrayList<SessionModel> models= new ArrayList<>();

        System.out.println("Checking for unspliced sessions...");
        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference();
        //System.out.println("Success, adding event listener...");

        Iterable<DataSnapshot> children = snapshot.getChildren();
        models.clear();

        //Loop through all sessions
        for (DataSnapshot child : children){
            SessionModel model = child.getValue(SessionModel.class);
            if(model.getSpliced()==0) {
                //Add to returning array if not yet spliced
                model.setId(Integer.parseInt(child.getKey()));
                models.add(model);
            }
        }

        //System.out.println("Success");
        //System.out.println("Waiting for response, if this takes too long it may mean there are no new sessions to segment.");

        //Waiting for DB response
//        do{
//            System.out.println("...");
//            try {
//                wait(2000);
//            } catch (InterruptedException e) {
//                System.out.println("Interrupted");
//            }
//        } while (models.size()==0);
        System.out.println(models.size() + " unprocessed sessions found");
        return models;
    }

    /**
     * Mark the given session as successfully spliced
     * @param id of the session
     */
    public void markSpliced(ArrayList<Integer> ids){
        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference();

        Map<String, Object> splice = new HashMap<String, Object>();
        splice.put("spliced", 1);
        Map<String, Object> sessions = new HashMap<String, Object>();
        for(int id : ids){
            sessions.put(Integer.toString(id), splice);
        }

        ref.child("sessions").updateChildren(sessions);
    }

    /**
     * Make a record of the given session's corresponding segments in the DB
     * @param session to record
     */
    public long recordSegments(SessionModel session, DataSnapshot wordlists, long index){
        Path directory = Paths.get("/home/fergus/AuCT/AuctJavaServer/src/output/"+session.getName());
        System.out.println("Recording segments in DB...");
        final ArrayList<Long> startingIndex = new ArrayList<>();
        startingIndex.add(index);
        try {

            DatabaseReference ref = FirebaseDatabase
                    .getInstance()
                    .getReference();

            //Hashmap is needed to ensure integer numbering in the DB
            HashMap<String, Object> segs = new HashMap<>();
            Files.walkFileTree(directory, new SimpleFileVisitor<Path>() {
                // Extract wordlist number from filename, to predict a label from
                int listNum = Integer.parseInt(
                        session.getName().substring(
                                session.getName().indexOf("list")+4,
                                session.getName().indexOf("_2"))
                )-1;

                // Getting all labels for the session
                ArrayList<String> list = getLabels(listNum, wordlists.child(listNum+"/words"));

                // Get the next available ID for segment
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    String label;
                    // Extract segment number from name
                    int segNum = Integer.parseInt(
                            file.toString().substring(
                                    file.toString().indexOf("seg_")+4,
                                    file.toString().indexOf("_a"))
                    )-1;
                    if(segNum>=list.size()-1){
                        //If there are too many segments, we suggest the last word in in the list
                        label = list.get(list.size()-1);
                    }
                    else {
                        label = list.get(segNum);
                    }
                    //Creating a new SegmentModel to update the DB with
                    SegmentModel segment = new SegmentModel(
                            "Output/" + file.toString().substring(file.toString().indexOf("_au")) +"/" +
                                    file.toString().substring(file.toString().indexOf("seg")),
                            label,
                            0,
                            session.getId(),
                            0);
                    segs.put(Long.toString(startingIndex.get(0)), segment);
                    startingIndex.set(0, startingIndex.get(0)+1);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                    return FileVisitResult.CONTINUE;
                }
            });
            ref.child("segments").updateChildren(segs); // Making the update call to the DB
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("Segment recorded in DB");
        return startingIndex.get(0);
    }


    /**
     * Get the next available segment ID
     * @return ID
     */
    public synchronized long getSegmentIndex(DataSnapshot snapshot){
        final ArrayList<Long> index = new ArrayList<>();
        index.add(0, Long.parseLong("-1"));
        index.set(0, snapshot.getChildrenCount());
//        DatabaseReference ref = FirebaseDatabase
//                .getInstance()
//                .getReference();
//        ref.child("segments").addListenerForSingleValueEvent(new ValueEventListener() {
//            @Override
//            public void onDataChange(DataSnapshot snapshot) {
//
//            }
//
//            @Override
//            public void onCancelled(DatabaseError error) {
//
//            }
//        });
//
//        //Waiting for DB response
//        do{
//            System.out.println("...");
//            try {
//                wait(2000);
//            } catch (InterruptedException e) {
//                System.out.println("Interrupted");
//            }
//        } while (index.get(0)==-1);
        return index.get(0);
    }

    /**
     * Get the words from a wordlist in the DB as an ArrayList
     * @param listNm The wordlist to load
     * @return ArrayList of labels
     */
    private synchronized ArrayList<String> getLabels(int listNm, DataSnapshot snapshot){
        final ArrayList<String> words = new ArrayList<>();
        ArrayList<String> list = (ArrayList)snapshot.getValue(); //Getting the words
        words.addAll(list); //Add them to our final variable
//        DatabaseReference ref = FirebaseDatabase
//                .getInstance()
//                .getReference();
//        ref.child("wordlists/" +listNm + "/words").addListenerForSingleValueEvent(new ValueEventListener() {
//            @Override
//            public void onDataChange(DataSnapshot snapshot) {
//
//            }
//
//            @Override
//            public void onCancelled(DatabaseError error) {
//
//            }
//        });

        //Waiting for DB response
        do{
            System.out.println("Waiting for labels...");
            try {
                wait(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }while (words.size() == 0);

        return words;

    }
}
