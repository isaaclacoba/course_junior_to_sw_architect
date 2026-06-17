using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Level3Capstone.Services;

// Kind: "problem" (red - this is the weld) or "target" (green - move it here).
public record CodeAnchor(int StartLine, int StartCol, int EndLine, int EndCol, string Kind, string Label);

public record MilestoneResult(int Id, string Title, bool Passed, string Detail, IReadOnlyList<CodeAnchor> Anchors);

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

        // 3. TestRunner receives the formatter via constructor, and never news it inside.
        var formatterCreation = runner == null ? null : FindCreationInside(runner, "Formatter");
        var takesFormatter = runner != null && formatterClass != null
            && ConstructorTakesType(runner, formatterClass.Identifier.Text);
        var m3 = takesFormatter && formatterCreation == null;

        // 4. A reporter interface with a Send method exists.
        var m4 = reporterIface != null;

        // 5. TestRunner depends on the reporter interface (injected), and never touches the console.
        var reporterCreation = runner == null ? null : FindCreationInside(runner, "Reporter");
        var consoleAccess = runner == null ? null : FindConsoleAccessInside(runner);
        var takesInterface = runner != null && ConstructorTakesInterface(runner, interfaces);
        var m5 = takesInterface && reporterCreation == null && consoleAccess == null;

        // 6. Two or more classes implement the reporter interface.
        var implementers = reporterIface == null
            ? 0
            : classes.Count(c => Implements(c, reporterIface.Identifier.Text));
        var m6 = implementers >= 2;

        // 7. TestRunner is run with two different reporter types - substitutability proven.
        var runnerCreations = RunnerCreations(root).ToList();
        var m7 = DistinctReporterTypes(runnerCreations) >= 2;

        var ctor = runner?.Members.OfType<ConstructorDeclarationSyntax>().FirstOrDefault();

        var passed = new[] { m1, m2, m3, m4, m5, m6, m7 };
        var anchors = new[]
        {
            // 1: point at the PASS/FAIL logic still trapped in TestRunner's method.
            m1 ? None() : AnchorsFor(LiteralAnchors(runner, "problem", "this PASS/FAIL logic wants its own class")),
            // 2: point at the leftover PASS/FAIL literals in TestRunner.
            m2 ? None() : AnchorsFor(LiteralAnchors(runner, "problem", "TestRunner still decides the words here")),
            // 3: red on the hand-built formatter, green on where it should arrive.
            m3 ? None() : Combine(
                Anchor(formatterCreation, "problem", "you build the formatter by hand here"),
                Anchor((SyntaxNode?)ctor ?? runner, "target", ctor != null ? "let it arrive through this constructor" : "a constructor goes here to receive it")),
            // 4: point at the console - the destination that wants an interface.
            m4 ? None() : Anchor(consoleAccess, "problem", "this console destination wants to become an interface"),
            // 5: red on the weld (new reporter or Console.), green on the constructor.
            m5 ? None() : Combine(
                Anchor((SyntaxNode?)reporterCreation ?? consoleAccess, "problem", "TestRunner is welded to one destination here"),
                Anchor((SyntaxNode?)ctor ?? runner, "target", ctor != null ? "inject an IReporter through this constructor" : "a constructor goes here to receive an IReporter")),
            // 6: nothing to point at - they must add a new class.
            None(),
            // 7: point at the single TestRunner construction in Main.
            m7 ? None() : Anchor(runnerCreations.FirstOrDefault(), "problem", "only one reporter is wired up - run a second, different one too"),
        };

        return Capstone.Milestones
            .Select((m, idx) => new MilestoneResult(
                m.Id, m.Title, passed[idx],
                passed[idx] ? m.PassMessage : m.TodoMessage,
                anchors[idx]))
            .ToList();
    }

    private static IReadOnlyList<CodeAnchor> None() => System.Array.Empty<CodeAnchor>();

    private static IReadOnlyList<CodeAnchor> AnchorsFor(IEnumerable<CodeAnchor> items) => items.ToList();

    private static IReadOnlyList<CodeAnchor> Combine(params IReadOnlyList<CodeAnchor>[] groups)
        => groups.SelectMany(g => g).ToList();

    private static IReadOnlyList<CodeAnchor> Anchor(SyntaxNode? node, string kind, string label)
        => node == null ? None() : new[] { ToAnchor(node, kind, label) };

    private static IEnumerable<CodeAnchor> LiteralAnchors(ClassDeclarationSyntax? cls, string kind, string label)
    {
        if (cls == null) yield break;
        var literal = cls.DescendantNodes().OfType<LiteralExpressionSyntax>()
            .FirstOrDefault(l => l.Token.ValueText is "PASS" or "FAIL");
        if (literal != null) yield return ToAnchor(literal.Parent ?? literal, kind, label);
    }

    private static CodeAnchor ToAnchor(SyntaxNode node, string kind, string label)
    {
        var span = node.GetLocation().GetLineSpan();
        return new CodeAnchor(
            span.StartLinePosition.Line + 1,
            span.StartLinePosition.Character + 1,
            span.EndLinePosition.Line + 1,
            span.EndLinePosition.Character + 1,
            kind, label);
    }

    private static ObjectCreationExpressionSyntax? FindCreationInside(ClassDeclarationSyntax cls, string typeNameFragment)
        => cls.DescendantNodes().OfType<ObjectCreationExpressionSyntax>()
            .FirstOrDefault(o => o.Type is IdentifierNameSyntax id && id.Identifier.Text.Contains(typeNameFragment));

    private static SyntaxNode? FindConsoleAccessInside(ClassDeclarationSyntax cls)
        => cls.DescendantNodes().OfType<MemberAccessExpressionSyntax>()
            .FirstOrDefault(m => m.Expression is IdentifierNameSyntax id && id.Identifier.Text == "Console");

    private static IEnumerable<ObjectCreationExpressionSyntax> RunnerCreations(SyntaxNode root)
        => root.DescendantNodes().OfType<ObjectCreationExpressionSyntax>()
            .Where(o => o.Type is IdentifierNameSyntax id && id.Identifier.Text == "TestRunner");

    private static int DistinctReporterTypes(IEnumerable<ObjectCreationExpressionSyntax> runnerCreations)
        => runnerCreations
            .SelectMany(o => o.ArgumentList?.Arguments ?? default)
            .Select(a => a.Expression)
            .OfType<ObjectCreationExpressionSyntax>()
            .Where(inner => inner.Type is IdentifierNameSyntax id && id.Identifier.Text.Contains("Reporter"))
            .Select(inner => ((IdentifierNameSyntax)inner.Type).Identifier.Text)
            .Distinct()
            .Count();

    private static bool MentionsLiterals(SyntaxNode node, params string[] needles)
    {
        var text = node.ToFullString();
        return needles.All(n => text.Contains($"\"{n}\""));
    }

    private static bool HasMethodNamed(InterfaceDeclarationSyntax iface, string name)
        => iface.Members.OfType<MethodDeclarationSyntax>().Any(m => m.Identifier.Text == name);

    private static bool ConstructorTakesType(ClassDeclarationSyntax cls, string typeName)
        => cls.Members.OfType<ConstructorDeclarationSyntax>()
            .Any(ctor => ctor.ParameterList.Parameters
                .Any(p => p.Type is IdentifierNameSyntax id && id.Identifier.Text == typeName));

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
