export function getCommentWorkspace(workspace: string): string {
  const workspaceTrimed = workspace.trim();

  if (workspaceTrimed.endsWith(',')) {
    return workspaceTrimed.substring(0, workspaceTrimed.length - 1);
  }

  return workspaceTrimed;
}
