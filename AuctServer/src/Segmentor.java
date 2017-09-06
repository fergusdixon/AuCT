import org.python.core.*;
import org.python.util.PythonInterpreter;

public class Segmentor {
    PythonInterpreter py;

    public Segmentor(){
        py = new PythonInterpreter();
        //importing the segmentation module

        py.exec("import sys\n" +
                "sys.path.append('/home/fergus')\n" +
                "sys.path.append('/home/fergus/.local/lib/python2.7/site-packages')\n");
        py.exec("print(sys.version)");
        py.exec("from pyAudioAnalysis import audioSegmentation as aS");
    }
    protected void segment(byte[] audio){
    }
}
