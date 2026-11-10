using System.Text;
using TaskChecker.Grading;
using TaskChecker.Submitter.Abstraction;

Console.OutputEncoding=Encoding.UTF8;
if(args.Any(arg=>arg!="--no-submit"))
{
    Console.Error.WriteLine("Használat: dotnet run --project Tests -- [--no-submit]");
    return 2;
}
Console.WriteLine("Ételkiszállító konyha – EF Core service és REST API pontozás");
Console.WriteLine("A tesztek elkülönített adatbázisokat használnak. A program nem indít éles API-kiszolgálót.");
Console.WriteLine();
var scores=await Grader.GradeAsync();
foreach(var spec in ExamCases.All)
{
    var taskScores=scores.Where(s=>s.TaskId!.Contains("."+spec.Id+".")).ToArray();
    Console.WriteLine(new string('=',76));
    Console.WriteLine($"{spec.Number:00}. {spec.Level} – {spec.Title}: {taskScores.Sum(s=>s.Points):0.##}/{taskScores.Sum(s=>s.MaxPoints):0.##} pont");
    foreach(var score in taskScores)
    {
        Console.WriteLine($"  {(score.TaskId!.EndsWith(".service")?"SERVICE":"CONTROLLER")}: {score.Points:0.##}/{score.MaxPoints:0.##} pont");
        foreach(var check in score.Checks)
        {
            Console.WriteLine($"    [{(check.Status==GradingResultStatus.Passed?"OK":"HIBA")}] {check.Title} ({check.Points:0.##}/{check.MaxPoints:0.##} p)");
            foreach(var message in check.Messages)
                foreach(var line in message.Split(Environment.NewLine))
                    Console.WriteLine("      "+line);
        }
    }
}
Console.WriteLine(new string('=',76));
Console.WriteLine($"SERVICE összesen: {scores.Where(s=>s.TaskId!.EndsWith(".service")).Sum(s=>s.Points):0.##}/64 pont");
Console.WriteLine($"CONTROLLER összesen: {scores.Where(s=>s.TaskId!.EndsWith(".api")).Sum(s=>s.Points):0.##}/36 pont");
Console.WriteLine($"ÖSSZESEN: {scores.Sum(s=>s.Points):0.##}/100 pont");
if(!args.Contains("--no-submit"))
{
    Console.WriteLine();
    if(!await ExamResultSubmitter.TrySubmitAsync(scores,GradingDetailMode.Diagnostics)) return 2;
}
return scores.All(s=>s.Points==s.MaxPoints)?0:1;

