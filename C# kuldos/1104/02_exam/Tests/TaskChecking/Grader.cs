using TaskChecker.Grading;

internal static class Grader
{
    private const string AssignmentId="backend-catering-statistics-exam";

    public static async Task<IReadOnlyList<TaskScore>> GradeAsync()
    {
        var scores=new List<TaskScore>();
        var tasks=ExamCases.All;
        if(tasks.Count!=10 || tasks.Sum(t=>t.ServiceMax+t.ApiMax)!=100)
            throw new InvalidOperationException("Hibás pontozási terv.");
        foreach(var spec in tasks)
        {
            if(spec.Cases.Sum(c=>c.Points)!=spec.ServiceMax) throw new InvalidOperationException(spec.Method);
            var outcomes=new List<(QueryCase Test,BackendChecks.Result Result)>();
            foreach(var test in spec.Cases)
                outcomes.Add((test,await BackendChecks.ServiceAsync(spec,test)));
            bool hasNonzero=outcomes.Any(o=>o.Result.Passed && !ExamCases.IsZero(o.Test.Expected));
            bool changed=outcomes.Any(o=>o.Result.Changed);
            var service=new ScoreBuilder($"{spec.Number:00}. {spec.Title} – service",spec.ServiceMax);
            foreach(var (test,result) in outcomes)
            {
                string reason=changed?"A service adatot módosított: a metódusra nem jár pont."
                    : ExamCases.IsZero(test.Expected)&&!hasNonzero
                        ?"Nulla/üres eredményért csak sikeres nem nulla teszt után jár pont.":"";
                bool passed=result.Passed && !changed && (hasNonzero || !ExamCases.IsZero(test.Expected));
                Add(service,spec,"service."+test.Id,test.Title,test.Points,result with {Passed=passed,Details=result.Details+" "+reason});
            }
            scores.Add(Finish(service,spec,"service"));

            var api=new ScoreBuilder($"{spec.Number:00}. {spec.Title} – controller",spec.ApiMax);
            decimal routePoints=spec.ApiMax==2?.5m:1m;
            decimal delegationPoints=spec.ApiMax==2?.5m:spec.ApiMax==4?1m:2m;
            Add(api,spec,"api.route","Controller-attribútumok és GET-útvonal.",routePoints,BackendChecks.Route(spec));
            Add(api,spec,"api.delegation","Az injektált service pontos hívása és Ok válasz.",delegationPoints,await BackendChecks.DelegationAsync(spec));
            decimal httpPoints=spec.ApiMax-routePoints-delegationPoints;
            bool validation=spec.Number is 7 or 10;
            if(validation)
            {
                Add(api,spec,"api.validation","Hibás paraméterek: 400 Bad Request, service-hívás nélkül.",1,await BackendChecks.ValidationAsync(spec));
                httpPoints-=1;
            }
            var regular=spec.Cases.Where(c=>!ExamCases.IsZero(c.Expected)).ToArray();
            var zero=spec.Cases.Where(c=>ExamCases.IsZero(c.Expected)).ToArray();
            var regularResult=await BackendChecks.HttpAsync(spec,regular);
            var zeroResult=await BackendChecks.HttpAsync(spec,zero);
            Add(api,spec,"api.http-values","Valódi HTTP kérések: szűrés, paraméterek, adatok és JSON-válasz.",httpPoints/2,regularResult);
            // Returning 0/[] for every HTTP request must not earn edge-case points.
            if(!regularResult.Passed)
                zeroResult=zeroResult with {Passed=false,Details=zeroResult.Details+" A pont feltétele a nem nulla HTTP-tesztek teljesítése."};
            Add(api,spec,"api.http-empty","Valódi HTTP kérések: üres adatbázis és találat nélküli eredmények.",httpPoints/2,zeroResult);
            scores.Add(Finish(api,spec,"api"));
        }
        return scores;
    }

    private static void Add(ScoreBuilder builder,TaskSpec spec,string id,string title,decimal points,BackendChecks.Result result)
    {
        string message=$"{title}\nElvárt: {result.Expected}\nKapott: {result.Actual}";
        if(!string.IsNullOrWhiteSpace(result.Details)) message+="\nMagyarázat: "+result.Details.Trim();
        // Expand real newlines for console readability and structured diagnostics.
        message=message.Replace("\n",Environment.NewLine);
        builder.Add(result.Passed,points,message,CheckDiagnostics.For(
            $"{AssignmentId}.{spec.Id}.{id}",[],title,
            evidence:new CheckEvidence{Expected=result.Expected,Actual=result.Actual,Details=result.Details}));
    }
    private static TaskScore Finish(ScoreBuilder builder,TaskSpec spec,string layer)
    {
        var score=builder.Build();
        score.TaskId=$"{AssignmentId}.{spec.Id}.{layer}";
        score.Title=score.Name;
        if(score.Checks.Sum(c=>c.MaxPoints)!=score.MaxPoints) throw new InvalidOperationException("Hibás részpontszám.");
        return score;
    }
}

