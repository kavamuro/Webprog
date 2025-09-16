using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Runtime.InteropServices;

namespace school
{
    public struct Student
    {
        public string StartYear;
        public string ClassOf;
        public string Name;
    }
    internal class Program
    {
        static void Main(string[] args)
        {
            List<Student> list = new List<Student>();
            Student s = new Student();
            foreach (var i in File.ReadAllLines("nevek.txt"))
            {
                string[] t = i.Split(';');
                s.StartYear = t[0];
                s.ClassOf = t[1];
                s.Name = t[2];
                list.Add(s);
            }
            Console.WriteLine("tanulok szama: "+list.Count);

            var longest = list.Max(x=> x.Name.Length);
            var longestName = list.Where(x=> x.Name.Length==longest).Select(x=>x.Name).ToList();

            foreach (var i in longestName)
            { 
                Console.WriteLine("leghosszabb nev: "+i);
                var withoutSpace = i.Replace(" ", "").Length;
                Console.WriteLine("nev hossza: " + withoutSpace);
            }

            Dictionary<string,string> codes = new Dictionary<string,string>();

            foreach (var i in list)
            {
                char ev = i.StartYear.Last();
                string[] name = i.Name.Split(' ');
                string code = ev + i.ClassOf + name[0].Substring(0,3) + name[1].Substring(0,3).ToLower();
                codes.Add(code, i.Name);
            }
            Console.WriteLine("elso diak adatai: " + codes.First());
            Console.WriteLine("utolso diak adatai: " + codes.Last());

            Console.WriteLine("kerem a keresett kezdesi evet: ");
            string year = Console.ReadLine();
            var students = list.Where(x => x.StartYear == year).Select(x=>x.Name).ToList();
            File.WriteAllLines("evdiak.txt", students);

            Console.WriteLine("kerem a kereset azonositot: ");
            string id = Console.ReadLine();
            var student = codes.Where(x => x.Key == id).Select(x=>x.Value).ToList();

            if (student.Count > 0)
            {
                student.First();
            }
            else
            {
                Console.WriteLine("nincs ilyen tanulo");
            }

            var searched = list.Where(x => x.StartYear == "2006" && x.ClassOf == "e").Select(x => x.Name).ToList();
            var ordered = searched.OrderBy(x => x);
            foreach (var r in ordered)
            {
                Console.WriteLine(r);
            }

            string passwordGenerate(int lenght)
            {
                string password = "";
                Random rn = new Random();
                while (password.Length < lenght)
                { 
                    char c= (char)rn.Next(48,123);
                    if ((c >= '0' && c <= '9')|| (c >= 'a' && c <= 'z'))
                            {
                        password += c;
                            }
                }
                return password;
            }

            Console.WriteLine("kerem a jelszo hosszat");
            int l= Convert.ToInt32(Console.ReadLine());
            Random rstudent = new Random();
            string randomstudent = list[rstudent.Next(0, list.Count - 1)].Name;
            Console.WriteLine("A veletlenszeruen valasztott diak: " + randomstudent + ", akinek a jelszava: " + passwordGenerate(l));

                Console.ReadLine();
        }
    }
}
