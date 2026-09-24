import java.util.Scanner;

public class SoutIn {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
//        IO.println("Elso pelda kiiratashoz.");
//        System.out.println("Masodik sor.");
//        int number = 1;
//        System.out.println("A number erteke: " + number);
//        System.out.print("Kozbulso sor. ");
//        System.out.printf("a number erteke maskent %d %n", number);
//
//        System.out.println("Kerek egy nevet: ");
//        String name = sc.next();
//        System.out.println(name);
//        System.out.println("Kerem a teljes neved: ");
//        String names = sc.nextLine();
//        System.out.println(names);
//
//
//        System.out.println("Kerek egy egesz szamot: ");
//        int egesz = sc.nextInt();
//        System.out.println(egesz);
//        System.out.println("Kerek egy tizedes szamot: ");
//        double tizedes = sc.nextDouble();
//        System.out.println(tizedes);
//        char karakter = sc.next().charAt(0);
//        System.out.println(karakter);

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
