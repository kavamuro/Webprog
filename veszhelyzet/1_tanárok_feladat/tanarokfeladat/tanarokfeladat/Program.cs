using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.ComponentModel;
using System.Diagnostics.Tracing;

namespace tanarokfeladat
{
    public struct Teacher 
    {
        public string name;
        public string subject;
        public int age;
        public int salary;
        public int experience;
    }
    internal class Program
    {
        static void Main(string[] args)
        {
            List<Teacher> list = new List<Teacher>();
            Teacher teacher = new Teacher();

            StreamReader file = new StreamReader("tanarok.txt");
            file.ReadLine();
            while (!file.EndOfStream) 
            {
                string line = file.ReadLine();
                string[] t = line.Split(';');

                teacher.name = t[0];
                teacher.subject = t[1];
                teacher.age = Convert.ToInt32(t[2]);
                teacher.salary = Convert.ToInt32(t[3]);
                teacher.experience = Convert.ToInt32(t[4]);

                list.Add(teacher);
            }
            file.Close();

            Console.WriteLine("tanarok szama:" + list.Count + " fo");
            int cnt = 0;
            foreach (var i in list) {
                if(i.subject=="Informatika")
                {
                    cnt++;
                } 
            }
            Console.WriteLine("info tanarok "+ cnt + " db");

            Teacher oldteacher = list[0];
            foreach (var i in list)
            {
                if (i.age > oldteacher.age)
                {
                    oldteacher = i;
                }
            }
            Console.WriteLine("legidosebb bloki {0}, aki kora {1}", oldteacher.name,oldteacher.age );

            double average = list.Average(x => x.age);
            Console.WriteLine("atleag fiatuetzz: " + average);

            Teacher minexp = list.Single(x => x.experience == list.Min(y => y.experience));

            Console.WriteLine($"{minexp.name}, {minexp.subject}, {minexp.age}, {minexp.salary}, {minexp.experience}!!!!");
            //vvxcvvxvsvdsdvdvdsvdvdsvsdvsdvdsvdsvdsvdsvds
            Console.ReadLine();
        }
    }
}
