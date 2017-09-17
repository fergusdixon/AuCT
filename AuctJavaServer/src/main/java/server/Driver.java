package server;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import server.Segmentor;

import java.io.FileInputStream;

public class Driver {


    public static void main(String[] args) {
        //getting the storage folder from firebase
        try{
            FileInputStream serviceAccount = new FileInputStream("/home/fergus/AuCT/AuctJavaServer/auct-capstone-firebase-adminsdk-57nym-694062f77b.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredential(FirebaseCredentials.fromCertificate(serviceAccount))
                    .setDatabaseUrl("https://auct-capstone.firebaseio.com/")
                    .build();

            FirebaseApp.initializeApp(options);
        }
        catch(Exception e){
            System.out.println(e);
        }


        Segmentor seg = new Segmentor("/home/fergus/AuCT/AuctJavaServer/src/main/java/server/");

        System.out.println(seg.segment("sample_fruit_quiet.wav"));
    }
}
