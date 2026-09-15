import java.util.Scanner;

public class Southioexample {
    static  void main()
    {
        String msg = "Im happy today!";
        int a = 150;
        int o = 0226;
        int h = 0x96;
        double d = 10;
        System.out.println(msg);
        System.out.println(a);
        System.out.println(o);
        System.out.println(h);
        System.out.println(d);

        Scanner sc = new Scanner(System.in);
        System.out.println("Your favourite song? Your asnwer: ");
        String music = sc.nextLine();

        System.out.println("Your favourite food? Your asnwer: ");
        String food = sc.nextLine();

        System.out.println("Your favourite hobby? Your asnwer: ");
        String hobby = sc.nextLine();

        System.out.println("Your favourite movie? Your asnwer: ");
        String movie = sc.nextLine();

        System.out.println("Your favourite destination? Your asnwer: ");
        String destination = sc.nextLine();

        System.out.println("Your favourite song: " + music);
        System.out.println("Your favourite food: " + food);
        System.out.println("Your favourite hobby: " + hobby);
        System.out.println("Your favourite movie: " + movie);
        System.out.println("Your favourite destination: " + destination);


    }
}
