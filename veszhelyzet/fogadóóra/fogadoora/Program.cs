
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace fogadoora
{
    public struct Fogadoora
    {
        public string veznev;
        public string kernev;
        public DateTime idopont;
        public string foglalasido;
    }
    internal class Program
    {
        static void Main(string[] args)
        {
            List<Fogadoora> lista = new List<Fogadoora>();
            Fogadoora f = new Fogadoora();
            foreach (var i in File.ReadAllLines("fogado.txt"))
            {
                string[] t = i.Split(' ');
                f.veznev = t[0];
                f.kernev = t[1];
                f.idopont = Convert.ToDateTime(t[2]);
                f.foglalasido = t[3];
                lista.Add(f);
            }
            
            Console.WriteLine("A foglalások száma:" + lista.Count);

            Console.WriteLine("Kerem a tanar nevet: ");
            string nev = Console.ReadLine();
            string[] n = nev.Split(' ');
            var idopontok = lista.Where(x => x.veznev == n[0] && x.kernev == n[1]).Count();
            var letezo = (idopontok == 0) ? "a megadott neven nincs fogalals!" : nev + "neven" + idopontok + "idopont foglalas";
            Console.WriteLine(letezo);

            Console.WriteLine("kerem a keresett udipintit:");
            DateTime d=Convert.ToDateTime(Console.ReadLine());
            var tanarok = lista.Where(x => x.idopont.Hour == d.Hour &&x.idopont.Minute == d.Minute).Select(x=> x.veznev + " " + x.kernev).ToList();
            var rendezett = tanarok.OrderBy(x => x);

            File.WriteAllLines("idop.txt", rendezett);

            var fogl = lista.Where(x => x.foglalasido.Contains("2017.11.06")).Count();
            Console.WriteLine(fogl);

            var be= lista.Where(x => x.veznev == "Barna"&& x.kernev == "Eszter").Select(x=> x.idopont).ToList();
            Console.WriteLine("Barni és alexcsiger uj videoi idopontjai: ");
            foreach (var i in be)
            { 
                Console.Write(i);
            }
            double ora = (be.Count * 10) / 60;
            Console.WriteLine("megbezselessel eltoltott ido oraban:" + ora);

            Console.ReadLine();
        }
    }

}
