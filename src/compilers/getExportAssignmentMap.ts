import * as tsm from 'ts-morph';

export function getExportAssignmentMap(sourceFile: tsm.SourceFile) {
  const exportAssignments = sourceFile.getExportAssignments();

  const exportAssignmentMap = exportAssignments
    .map((exportAssignment) => {
      const exportAssignmentName = exportAssignment
        .getChildren()
        .map((node) => {
          const name =
            node.getKind() === tsm.SyntaxKind.Identifier ? node.getText().trim() : undefined;
          return name;
        })
        .filter((name) => name != null)
        .at(0);

      return { node: exportAssignment, name: exportAssignmentName ?? '__default' };
    })
    .reduce<Map<string, tsm.ExportAssignment>>((aggregation, node) => {
      aggregation.set(node.name, node.node);
      return aggregation;
    }, new Map<string, tsm.ExportAssignment>());

  return exportAssignmentMap;
}
