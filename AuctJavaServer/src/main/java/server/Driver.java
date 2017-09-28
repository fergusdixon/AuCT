package server;

public class Driver {
    public static void main(String[] args) {
        FileProcessor splitter = new FileProcessor();
        splitter.processFile("auct_list02_20170928123423.wav");
    }
}
