import java.util.Scanner;

public class IFELSEtask {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Kérem az első számot: ");
        int szam1 = scanner.nextInt();

        System.out.print("Kérem a második számot: ");
        int szam2 = scanner.nextInt();

        if (szam1 > szam2) {
            System.out.println("A két szám közül az első szám a nagyobb.");
        } else if (szam2 > szam1) {
            System.out.println("A két szám közül a második szám a nagyobb.");
        } else {
            System.out.println("A két szám egyenlő.");
        }
        System.out.print("Kérem a magasságot (cm): ");
        int magassag = scanner.nextInt();

        if (magassag >= 150 && magassag < 165) {
            System.out.println("S");
        } else if (magassag >= 165 && magassag < 175) {
            System.out.println("M");
        } else if (magassag >= 175 && magassag < 185) {
            System.out.println("L");
        } else if (magassag >= 185 && magassag <= 195) {
            System.out.println("XL");
        } else {
            System.out.println("NO SIZE");
        }

        System.out.print("Kérem az első számot: ");
        int a = scanner.nextInt();

        System.out.print("Kérem a második számot: ");
        int b = scanner.nextInt();

        System.out.print("Kérem a harmadik számot: ");
        int c = scanner.nextInt();

        int legnagyobb = 0;
        int kozepso = 0;
        int legkisebb = 0;

        if (a >= b && a >= c) {
            legnagyobb = a;
            if (b >= c) {
                kozepso = b;
                legkisebb = c;
            } else {
                 kozepso = c;
                 legkisebb = b;
            }
        } else if (b >= a && b >= c) {
             legnagyobb = b;
            if (a >= c) {
                kozepso = a;
                legkisebb = c;
            } else {
                kozepso = c;
                legkisebb = a;
            }
        } else {
            legnagyobb = c;
            if (a >= b) {
                kozepso = a;
                legkisebb = b;
            } else {
                kozepso = b;
                legkisebb = a;
            }
        }
        System.out.println(legnagyobb + "a legnagyobb");
        System.out.println(kozepso + "a masodik legnagyobb");
        System.out.println(legkisebb + "a legkisebb");
    }
}
