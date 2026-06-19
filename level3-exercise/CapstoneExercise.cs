namespace CodeLab.Host;

// The Level 3 capstone, supplied to the generic code-lab host. It owns all
// exercise-specific content: the brief, the starter and reference code, the
// milestones, and the structural checks that grade a submission.
public sealed class CapstoneExercise : IExercise
{
    public string Title => "Capstone: SOLID in practice";

    public string Lead => "Refactor a small, working program one step at a time. It compiles and runs right here in your browser.";

    public string Brief =>
        "This TestRunner works, but it does three jobs at once and is welded to the console. " +
        "Reshape it so each job lives where it belongs. You do not have to do it all at once - " +
        "chip away, and watch the milestones below fill in as you go.";

    public string StarterCode => Capstone.StarterCode;

    public string ReferenceSolution => Capstone.ReferenceSolution;

    public IReadOnlyList<Milestone> Milestones => Capstone.Milestones;

    public IReadOnlyList<MilestoneResult> Check(string code) => StructuralChecks.Run(code);
}
