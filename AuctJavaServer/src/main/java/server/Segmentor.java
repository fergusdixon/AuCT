package server;

import java.io.File;

public class Segmentor {
    private String dir;
    public Segmentor(String scriptDir){
        this.dir = scriptDir;
    }

    /**
     * Split the given local file with ffmpeg
     * @param inputPath of audio
     * @return success
     */
    public boolean segment(String inputPath){
        try
        {
            String scriptLocation = new File("src/main/java/server/process.sh").getAbsolutePath();
            ProcessBuilder pb = new ProcessBuilder(scriptLocation, inputPath+".wav");
            pb.directory(new File(dir));
            Process process = pb.start();
            process.waitFor();
            return true;

        } catch (Throwable t)
        {
            t.printStackTrace();
            return false;
        }
    }
}
