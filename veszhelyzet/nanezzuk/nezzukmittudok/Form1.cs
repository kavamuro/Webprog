using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace nezzukmittudok
{
    public partial class Form1 : Form
    {
        List<string> students = File.ReadAllLines("diakadatok.txt").ToList();
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            
        }

        private void button1_Click(object sender, EventArgs e)
        {
            foreach (string student in students)
            {

                listBox1.Items.Add(student);
            }
            
        }

        private void button2_Click(object sender, EventArgs e)
        {
            foreach(string student in students) {
                if (student.Contains("9a")) { 
                    
                };
                    
        }
    }
}
