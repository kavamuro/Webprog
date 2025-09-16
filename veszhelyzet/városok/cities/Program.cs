using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace cities
{
    public struct Varosok
    {
        public string nev;
        public string tipus;
        public string megye;
        public string jarasNev;
        public string kistersegNev;
        public int nepesseg;
        public double teruletSzerkezet;

        public override string ToString()
        {
            return $"{nev}\n{tipus}\n{megye}\n{jarasNev}\n{kistersegNev}\n{nepesseg}\n{teruletSzerkezet}";
        }
    }
    internal class Program
    {
        static void Main(string[] args)
        {
            List<Varosok> list = new List<Varosok>();
            Varosok v = new Varosok();
            foreach (var i in File.ReadAllLines("varosok.txt"))
            {
                string[] t = i.Split('\t');
                v.nev = t[0];
                v.tipus = t[1];
                v.megye = t[2];
                v.jarasNev = t[3];
                v.kistersegNev = t[4];
                v.nepesseg = Convert.ToInt32(t[5]);
                v.teruletSzerkezet = Convert.ToDouble(t[6]);
                list.Add(v);
            }
            //2
            Console.WriteLine("telepulesek szama: " + list.Count());
            //3
            int varosTipus = list.Where(x => x.tipus == "város").Count();
            Console.WriteLine("ennyi varos tipusu telepules van: " + varosTipus);
            //4
            double legnagyobb = list.Max(x => x.teruletSzerkezet);
            Varosok legnagyobbVaros = list.Single(x => x.teruletSzerkezet == legnagyobb);
            Console.WriteLine(legnagyobbVaros);
            //5

            bool nagykallo = list.Any(x => x.jarasNev == "Nagykállói");
            if (nagykallo)
            {
                Console.WriteLine("van olyan telepules ami nagykalloi jarasban van.");
            }
            else
            {
                Console.WriteLine("nincs olyan telepules ami nagykalloi jarasban van.");
            }
            //6
             
            int mennyi = list.Where(x => x.nepesseg >= 50000 && x.nepesseg <=100000).Count();

            Console.WriteLine("ennyi van 50k es 100k kozott" + mennyi);

            //7

            var bekesmegye = list.Where(x=> x.megye == "Békés").Select(x=>x.nev).ToList();
            File.WriteAllLines("bekes.txt", bekesmegye);

            //8
            var tersegek = list.Select(x => x.kistersegNev);
            Dictionary<string,int> jarasTelep = new Dictionary<string,int>();
            foreach (string terseg in tersegek)
            {
                jarasTelep[terseg] = 0;
            }
            foreach (Varosok varos in list)
            {
                jarasTelep[varos.jarasNev]++;
            }
            foreach (KeyValuePair<string, int> item in jarasTelep)
            { 
                Console.WriteLine($"{item.Key} : {item.Value}");
            }

            Console.ReadLine();
        }
    }
}
