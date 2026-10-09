import java.util.Scanner;

public class array {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Hány egész számot szeretne megadni? ");
        int db = sc.nextInt();

        int[] szamok = new int[db];

        for (int i = 0; i < db; i++) {
            System.out.print((i + 1) + ". egész szám: ");
            szamok[i] = sc.nextInt();
        }

        System.out.println("\nA megadott tömb elemei:");
        for (int szam : szamok) {
            System.out.print(szam + " ");
        }
        System.out.println();

        System.out.print("Hány tizedes számot szeretne megadni? ");
        int db2 = sc.nextInt();

        double[] szamok2 = new double[db2];

        for (int i = 0; i < db; i++) {
            System.out.print((i + 1) + ". tizedes szám: ");
            szamok2[i] = sc.nextDouble();
        }

        System.out.println("\nA megadott tömb elemei:");
        for (double szam : szamok2) {
            System.out.print(szam + " ");
        }
        System.out.println();

        System.out.print("Hány szöveget szeretne megadni? ");
        int db3 = sc.nextInt();
        sc.nextLine();

        String[] szovegek = new String[db3];

        for (int i = 0; i < db3; i++) {
            System.out.print((i + 1) + ". szöveg: ");
            szovegek[i] = sc.nextLine();
        }

        System.out.println("\nA megadott tömb elemei:");
        for (String szoveg : szovegek) {
            System.out.print(szoveg + " ");
        }
        System.out.println();
    }
}
