package server;

import java.io.File;

public class Segmentor {
    private String dir;
    public Segmentor(String scriptDir){
        this.dir = scriptDir;
    }

    /**
     * This segments a given file using ffmpeg, filter: silencedetect=noise=-30dB:d=0.5
     * @param inputPath: file to segment
     * @return success or failure
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
