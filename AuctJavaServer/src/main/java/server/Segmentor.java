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
            ProcessBuilder pb = new ProcessBuilder(dir + "process.sh", inputPath+".wav");
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
