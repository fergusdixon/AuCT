package server;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import com.google.firebase.cloud.StorageClient;

import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;

public class FileProcessor {

    private Bucket bucket = null;
    private String fileName;

    public void processFile(String fileName) {
        System.out.println("Retrieving cloud storage...");
//        login();
        bucket = StorageClient.getInstance().bucket();
        System.out.println("Success");

        //Download file
        this.fileName = fileName;
        System.out.println("Downloading: " + fileName + "...");
        getAudio(fileName);

        //Split file
        System.out.println("Success, analysing and segmenting the audio file...");
        if(split()){
            System.out.println("Splitting of \"" + fileName + "\" successful.");
        }
        else {
            System.out.println("Splitting failed");
        }

        //Upload segments
        System.out.println("Beginning upload...");
        int counter = 1;
        File folder = new File(
                "/home/fergus/AuCT/AuctJavaServer/src/output/" +
                        fileName
        );
        for (final File fileEntry : folder.listFiles()) {
            upload(fileEntry);
            System.out.println("Uploaded segement: " + counter);
            counter++;
        }



        System.out.println("Upload complete.");
    }

    public void deleteSegments(){
        //Delete local segments
        Path directory = Paths.get("/home/fergus/AuCT/AuctJavaServer/src/output/"+fileName);
        try {
            Files.walkFileTree(directory, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    Files.delete(file);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                    Files.delete(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * This takes a given file and uploads it to the appropriate place in Firebase.
     * @param file
     */
    private void upload(File file){
        InputStream blob = null;
        try {
            blob = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        bucket.create("Output/"+fileName+"/"+file.getName(), blob, "audio/x-wav");
    }

    /**
     * This splits the current file
     * @return boolean
     */
    private boolean split(){
        Segmentor seg = new Segmentor("/home/fergus/AuCT/AuctJavaServer/src/main/java/server/");

        return seg.segment(fileName.substring(fileName.indexOf('/')+1));
    }

    /**
     * Download the requested audio file from Firebase
     * @param name
     */
    private void getAudio(String name){
        //getting file
        if(bucket == null){

        }
        Blob blob = bucket.get("Input/" + name + ".wav");
        byte[] array = blob.getContent();

        String uncutName = blob.getName();

        fileName = blob.getName().substring(
                uncutName.indexOf('/')+1,
                uncutName.indexOf('.')
        );

        File f = null;
        try {
            String path = "/home/fergus/AuCT/AuctJavaServer/src/input/" + fileName + ".wav";
            f = new File(path);

            f.getParentFile().mkdirs();
            f.createNewFile();
            FileOutputStream out = new FileOutputStream(f);
            out.write( array );
            out.close();
            f.deleteOnExit();
            System.out.println("File written");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Login to the cloud storage server, currently not in use because DbHelper logs in first
     */
    private void login() {
        //getting the storage folder from firebase

        try {
            FileInputStream serviceAccount = new FileInputStream("/home/fergus/AuCT/AuctJavaServer/auct-capstone-firebase-adminsdk-57nym-694062f77b.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredential(FirebaseCredentials.fromCertificate(serviceAccount))
                    .setDatabaseUrl("https://auct-capstone.firebaseio.com/")
                    .setStorageBucket("auct-capstone.appspot.com")
                    .build();

            FirebaseApp.initializeApp(options);
            bucket = StorageClient.getInstance().bucket();
            serviceAccount.close();
        } catch (Exception e) {
            System.out.println("Firebase error:\n" + e);
        }
    }
}
