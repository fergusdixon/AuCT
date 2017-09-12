public class Driver {

    public static void main(String[] args) {
        Segmentor seg = new Segmentor("/home/fergus/AuCT/AuctJavaServer/src/");

        System.out.println(seg.segment("sample_fruit_quiet.wav"));
    }
}
