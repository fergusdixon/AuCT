package server;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import com.google.firebase.cloud.StorageClient;

import java.io.*;

public class Driver {

    private static Bucket bucket = null;
    private static String fileName;

    public static void main(String[] args) {
        System.out.println("Retrieving cloud storage...");
        login();
        System.out.println("Success");

        fileName = "sample_sports_television";
        System.out.println("Downloading: " + fileName + "...");
        //getAudio(fileName);

        System.out.println("Success, analysing and segmenting the audio file...");
        if(split()){
            System.out.println("Splitting of \"" + fileName + "\" successful.");
        }
        else {
            System.out.println("Splitting failed");
        }
    }

    private static boolean split(){
        Segmentor seg = new Segmentor("/home/fergus/AuCT/AuctJavaServer/src/main/java/server/");

        return seg.segment(fileName+".wav");
    }

    private static void getAudio(String name){
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

    private static void login(){
        //getting the storage folder from firebase

        try{
            FileInputStream serviceAccount = new FileInputStream("/home/fergus/AuCT/AuctJavaServer/auct-capstone-firebase-adminsdk-57nym-694062f77b.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredential(FirebaseCredentials.fromCertificate(serviceAccount))
                    .setDatabaseUrl("https://auct-capstone.firebaseio.com/")
                    .setStorageBucket("auct-capstone.appspot.com")
                    .build();

            FirebaseApp.initializeApp(options);
            bucket = StorageClient.getInstance().bucket();
            serviceAccount.close();
        }
        catch(Exception e){
            System.out.println("Firebase error:\n" + e);
        }
    }
}
