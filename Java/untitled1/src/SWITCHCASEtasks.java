import java.util.Scanner;

public class SWITCHCASEtasks {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Kérem az érdemjegyet: ");
        int szam1 = scanner.nextInt();
        String grade = switch (szam1){
            case 1-> "Elegtelen";
            case 2-> "Elegséges";
            case 3-> "Közepes";
            case 4-> "Jó";
            case 5-> "Jeles";
            default -> "Érvénytelen érdemjegy";
        };

        System.out.println("Eredmény: " + grade);
        scanner.close();

    }
}
