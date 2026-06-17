using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Level3Capstone.Services;

public record MilestoneResult(int Id, string Title, bool Passed, string Detail);

public class StructuralChecks
{
    public static List<MilestoneResult> Run(string code)
    {
        var root = CSharpSyntaxTree.ParseText(code).GetRoot();
        var classes = root.DescendantNodes().OfType<ClassDeclarationSyntax>().ToList();
        var interfaces = root.DescendantNodes().OfType<InterfaceDeclarationSyntax>().ToList();

        var runner = classes.FirstOrDefault(c => c.Identifier.Text == "TestRunner");
        var reporterIface = interfaces.FirstOrDefault(i => HasMethodNamed(i, "Send"))
            ?? interfaces.FirstOrDefault(i => i.Identifier.Text.Contains("Report"));

        // 1. A formatter class (not TestRunner/Program) holds the PASS/FAIL words.
        var formatterClass = classes.FirstOrDefault(c =>
            c.Identifier.Text != "TestRunner" &&
            c.Identifier.Text != "Program" &&
            MentionsLiterals(c, "PASS", "FAIL"));
        var m1 = formatterClass != null;

        // 2. TestRunner no longer holds the PASS/FAIL words.
        var m2 = runner != null && !MentionsLiterals(runner, "PASS", "FAIL");

        // 3. A reporter interface with a Send method exists.
        var m3 = reporterIface != null;

        // 4. TestRunner receives the reporter via constructor, with no new ...Reporter() inside.
        var takesInterface = runner != null && ConstructorTakesInterface(runner, interfaces);
        var newsReporter = runner != null && CreatesReporterInside(runner);
        var m4 = takesInterface && !newsReporter;

        // 5. Two or more classes implement the reporter interface.
        var implementers = reporterIface == null
            ? 0
            : classes.Count(c => Implements(c, reporterIface.Identifier.Text));
        var m5 = implementers >= 2;

        var passed = new[] { m1, m2, m3, m4, m5 };
        return Capstone.Milestones
            .Select((m, idx) => new MilestoneResult(
                m.Id, m.Title, passed[idx],
                passed[idx] ? m.PassMessage : m.TodoMessage))
            .ToList();
    }

    private static bool MentionsLiterals(SyntaxNode node, params string[] needles)
    {
        var text = node.ToFullString();
        return needles.All(n => text.Contains($"\"{n}\""));
    }

    private static bool HasMethodNamed(InterfaceDeclarationSyntax iface, string name)
        => iface.Members.OfType<MethodDeclarationSyntax>().Any(m => m.Identifier.Text == name);

    private static bool CreatesReporterInside(ClassDeclarationSyntax cls)
        => cls.DescendantNodes().OfType<ObjectCreationExpressionSyntax>()
            .Any(o => o.Type is IdentifierNameSyntax id && id.Identifier.Text.Contains("Reporter"));

    private static bool ConstructorTakesInterface(ClassDeclarationSyntax cls, List<InterfaceDeclarationSyntax> interfaces)
    {
        var ifaceNames = interfaces.Select(i => i.Identifier.Text).ToHashSet();
        return cls.Members.OfType<ConstructorDeclarationSyntax>()
            .Any(ctor => ctor.ParameterList.Parameters
                .Any(p => p.Type is IdentifierNameSyntax id && ifaceNames.Contains(id.Identifier.Text)));
    }

    private static bool Implements(ClassDeclarationSyntax cls, string interfaceName)
        => cls.BaseList?.Types.Any(t => t.Type is IdentifierNameSyntax id && id.Identifier.Text == interfaceName) == true;
}
