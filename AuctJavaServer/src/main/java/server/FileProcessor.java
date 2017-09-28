package server;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import com.google.firebase.cloud.StorageClient;

import java.io.*;

public class FileProcessor {

    private Bucket bucket = null;
    private String fileName;

    public void processFile(String fileName) {
        System.out.println("Retrieving cloud storage...");
        login();
        System.out.println("Success");

        this.fileName = fileName;
        System.out.println("Downloading: " + fileName + "...");
        getAudio(fileName);

        System.out.println("Success, analysing and segmenting the audio file...");
        if(split()){
            System.out.println("Splitting of \"" + fileName + "\" successful.");
        }
        else {
            System.out.println("Splitting failed");
        }

        System.out.println("Beginning upload...");
        int counter = 1;
        File folder = new File(
                "/home/fergus/AuCT/AuctJavaServer/src/output/" +
                        fileName.substring(0, fileName.length()-4)
        );
        System.out.println(folder.listFiles());
        for (final File fileEntry : folder.listFiles()) {
            upload(fileEntry);
            System.out.println("Uploaded segement: " + counter);
            counter++;
        }
        System.out.println("Upload complete.");
    }

    private void upload(File file){
        InputStream blob = null;
        try {
            blob = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        bucket.create("Output/"+fileName+"/"+file.getName(), blob, "audio/x-wav");
    }

    private boolean split(){
        Segmentor seg = new Segmentor("/home/fergus/AuCT/AuctJavaServer/src/main/java/server/");

        return seg.segment(fileName+".wav");
    }

    private void getAudio(String name){
        //getting file
        Blob blob = bucket.get("Input/" + name);
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
