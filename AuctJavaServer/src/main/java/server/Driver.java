package server;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import com.google.firebase.cloud.StorageClient;

import java.io.*;

public class Driver {


    public static void main(String[] args) {
        //getting the storage folder from firebase
        Bucket bucket = null;
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


        //getting file
        Blob blob = bucket.get("Input/sample_fruit_quiet.wav");
        byte[] array = blob.getContent();

        String uncutName = blob.getName();

        String fileName = blob.getName().substring(
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
            System.out.println("File written");
        } catch (IOException e) {
            e.printStackTrace();
        }


        System.out.println("Splitting");
        Segmentor seg = new Segmentor("/home/fergus/AuCT/AuctJavaServer/src/main/java/server/");

        System.out.println(seg.segment(fileName+".wav"));
    }
}
