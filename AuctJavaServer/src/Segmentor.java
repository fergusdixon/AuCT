import java.io.File;

public class Segmentor {
    private String dir;
    public Segmentor(String scriptDir){
        this.dir = scriptDir;
    }

    public boolean segment(String inputPath){
        try
        {
            ProcessBuilder pb = new ProcessBuilder(dir + "process.sh", inputPath);
            pb.directory(new File(dir));
            Process process = pb.start();
            return true;

        } catch (Throwable t)
        {
            t.printStackTrace();
            return false;
        }
    }
}